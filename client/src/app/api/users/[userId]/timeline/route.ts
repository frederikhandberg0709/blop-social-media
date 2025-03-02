import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import prisma from "@/db/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const { userId } = await params;
    const session = await getServerSession(authOptions);
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get("cursor");
    const limit = 10;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const posts = await prisma.post.findMany({
      where: {
        userId: userId,
      },
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        _count: {
          select: {
            likes: true,
            comments: true,
            quotes: true,
            shares: true,
          },
        },
        quotes: {
          include: {
            quotedPost: {
              include: {
                user: true,
              },
            },
          },
        },
        likes: session
          ? {
              where: {
                userId: session.user.id,
              },
            }
          : false,
      },
    });

    let nextCursor: string | undefined;
    if (posts.length > limit) {
      const nextItem = posts.pop();
      nextCursor = nextItem?.id;
    }

    const transformedPosts = posts.map((post) => ({
      ...post,
      userLiked: post.likes?.length > 0,
      likes: undefined,
    }));

    return NextResponse.json({
      posts: transformedPosts,
      nextCursor,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
