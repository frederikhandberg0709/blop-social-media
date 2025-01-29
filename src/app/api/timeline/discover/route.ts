import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 20;

    let posts;

    if (userId) {
      // Fetch posts from users the logged-in user doesn't follow
      const followingIds = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });

      const followingUserIds = followingIds.map((follow) => follow.followingId);

      posts = await prisma.post.findMany({
        where: {
          userId: {
            notIn: [...followingUserIds, userId],
          },
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
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
    } else {
      // Fetch all posts for non-logged-in users
      posts = await prisma.post.findMany({
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
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
    }

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching discover posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
