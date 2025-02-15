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
    // Validate that userId is provided
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Validate that content is present and not empty
    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Content field is mandatory and cannot be empty" },
        { status: 400 },
      );
    }

    // Extract quoted post IDs from the content
    const quotedPostIds = extractQuotedPostIds(content);

    // Use a transaction to ensure all operations are performed atomically
    const post = await prisma.$transaction(async (prisma) => {
      // Create the new post
      const newPost = await prisma.post.create({
        data: {
          userId,
          title,
          content,
        },
      });

      // Create QuotedPost entries and update quote counts
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
