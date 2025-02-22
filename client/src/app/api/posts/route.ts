import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getTimestamp } from "@/utils/getTimestamp";

// Fetch all posts

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
        comments: true,
        likes: true,
      },
    });

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt?.toISOString(),
      timestamp: getTimestamp(
        post.createdAt.toISOString(),
        post.updatedAt?.toISOString(),
      ),
      likesCount: post.likes.length,
      userLiked: false,
      user: {
        id: post.user.id,
        username: post.user.username,
        profileName: post.user.profileName,
        profilePicture: post.user.profilePicture,
        profileBanner: post.user.profileBanner,
        bio: post.user.bio,
        // followersCount: post.user.followers,
        // followingCount: post.user.followingCount,
        // postsCount: post.user.postsCount,
      },
    }));

    return NextResponse.json({ posts: formattedPosts }, { status: 200 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Create post

export async function POST(request: NextRequest) {
  const { userId, title, content } = await request.json();

  try {
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Content field is mandatory and cannot be empty" },
        { status: 400 },
      );
    }

    const quotedPostIds = extractQuotedPostIds(content);

    const post = await prisma.$transaction(async (prisma) => {
      const newPost = await prisma.post.create({
        data: {
          userId,
          title,
          content,
        },
      });

      if (quotedPostIds.length > 0) {
        await Promise.all(
          quotedPostIds.map(async (quotedPostId: string) => {
            await prisma.quotedPost.create({
              data: {
                quotedPostId: quotedPostId,
                quotingPostId: newPost.id,
              },
            });

            await prisma.post.update({
              where: { id: quotedPostId },
              data: { quoteCount: { increment: 1 } },
            });
          }),
        );
      }

      const usersToNotify = await prisma.profileNotificationSettings.findMany({
        where: {
          targetProfileId: userId,
          OR: [
            { notificationType: "ALL" },
            {
              notificationType: "SPECIFIC",
              notifyNewPosts: true,
            },
          ],
        },
        select: {
          userId: true,
        },
      });

      await prisma.notificationHistory.createMany({
        data: usersToNotify.map(({ userId: recipientId }) => ({
          userId: recipientId,
          fromUserId: userId,
          notificationType: "NEW_POST",
          content: "New post published",
          metaData: {
            postId: newPost.id,
            postTitle: title || "Untitled",
          },
        })),
      });

      try {
        await fetch("http://localhost:4000/notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userIds: usersToNotify.map((u) => u.userId),
            notification: {
              type: "NEW_POST",
              postId: newPost.id,
              postTitle: title || "Untitled",
            },
          }),
        });
      } catch (error) {
        console.error("Failed to send socket notification:", error);
      }

      return newPost;
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function extractQuotedPostIds(content: string): string[] {
  const regex = /\/post\/([a-zA-Z0-9-_]+)/g;
  const matches = content.matchAll(regex);
  return [...new Set(Array.from(matches, (m) => m[1]))];
}
