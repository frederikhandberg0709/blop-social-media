import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user.id;

    // Get the IDs of users that the current user follows
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followedUserId: true },
    });
    const followingIds = following.map((f) => f.followedUserId);

    // Fetch posts from followed users
    const posts = await prisma.post.findMany({
      where: {
        userId: { in: followingIds },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profileName: true,
            profilePicture: true,
          },
        },
        likes: true,
        _count: {
          select: { comments: true, likes: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Fetch shares from followed users
    const shares = await prisma.postShare.findMany({
      where: {
        userId: { in: followingIds },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profileName: true,
            profilePicture: true,
          },
        },
        post: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profileName: true,
                profilePicture: true,
              },
            },
            likes: true,
            _count: {
              select: { comments: true, likes: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const timeline = [...posts, ...shares]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 50);

    const formattedTimeline = timeline.map((item) => {
      if ("post" in item) {
        // This is a shared post
        return {
          type: "shared",
          id: item.id,
          sharedBy: item.user,
          sharedAt: item.createdAt,
          post: {
            ...item.post,
            initialLikesCount: item.post._count.likes,
            userLiked: item.post.likes.some((like) => like.userId === userId),
          },
        };
      } else {
        // This is an original post
        return {
          type: "original",
          ...item,
          initialLikesCount: item._count.likes,
          userLiked: item.likes.some((like) => like.userId === userId),
        };
      }
    });

    return NextResponse.json({ posts: formattedTimeline });
  } catch (error) {
    console.error("Error fetching following timeline:", error);
    return NextResponse.json(
      { error: "Failed to fetch following timeline" },
      { status: 500 },
    );
  }
}
