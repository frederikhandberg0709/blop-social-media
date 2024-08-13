import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

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
      select: { followingId: true },
    });
    const followingIds = [...following.map((f) => f.followingId), userId]; // Include the user's own posts

    // Fetch posts from followed users and the user's own posts
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

    // Fetch shares from followed users and the user's own shares
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

    const timeline = [
      ...posts.map((post) => ({
        type: "original" as const,
        id: post.id,
        user: post.user,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        title: post.title,
        content: post.content,
        initialLikesCount: post._count.likes,
        userLiked: post.likes.some((like) => like.userId === userId),
        sortDate: post.createdAt,
      })),
      ...shares.map((share) => ({
        type: "shared" as const,
        id: share.id,
        sharedBy: share.user,
        sharedAt: share.createdAt,
        post: {
          id: share.post.id,
          user: share.post.user,
          createdAt: share.post.createdAt,
          updatedAt: share.post.updatedAt,
          title: share.post.title,
          content: share.post.content,
          initialLikesCount: share.post._count.likes,
          userLiked: share.post.likes.some((like) => like.userId === userId),
        },
        sortDate: share.createdAt,
      })),
    ]
      .sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime())
      .slice(0, 50);

    return NextResponse.json({ posts: timeline });
  } catch (error) {
    console.error("Error fetching home timeline:", error);
    return NextResponse.json(
      { error: "Failed to fetch home timeline" },
      { status: 500 },
    );
  }
}
