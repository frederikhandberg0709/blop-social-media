import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

// Get likes count for a post
export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } },
) {
  const userId = req.nextUrl.searchParams.get("userId");
  const { postId } = await params;

  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    const likesCount = await prisma.postLike.count({
      where: { postId },
    });

    let userLiked = false;
    if (userId) {
      const liked = await prisma.postLike.findFirst({
        where: {
          postId,
          userId,
        },
      });
      userLiked = !!liked;
    }

    return NextResponse.json(
      {
        likesCount,
        userLiked: !!userLiked,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch likes count" },
      { status: 500 },
    );
  }
}

// Like a post

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } },
) {
  try {
    const { userId } = await req.json();
    const { postId } = await params;

    const like = await prisma.postLike.create({
      data: {
        postId,
        userId,
      },
    });

    return NextResponse.json(like, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to like post", details: error },
      { status: 500 },
    );
  }
}

// Unlike a post

export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } },
) {
  try {
    const { userId } = await req.json();
    const { postId } = params;

    const unlike = await prisma.postLike.deleteMany({
      where: {
        postId,
        userId,
      },
    });

    return NextResponse.json(unlike, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to unlike post", details: error },
      { status: 500 },
    );
  }
}
