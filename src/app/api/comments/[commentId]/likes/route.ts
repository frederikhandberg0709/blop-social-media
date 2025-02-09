import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Get likes count for a comment

export async function GET(
  req: NextRequest,
  { params }: { params: { commentId: string } },
) {
  const userId = req.nextUrl.searchParams.get("userId");
  const { commentId } = params;

  try {
    const likesCount = await prisma.commentLike.count({
      where: { commentId },
    });

    let userLiked = false;
    if (userId) {
      const liked = await prisma.commentLike.findFirst({
        where: {
          commentId,
          userId,
        },
      });
      userLiked = !!liked;
    }

    return NextResponse.json(
      {
        likesCount,
        userLiked,
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

// Like a comment

export async function POST(
  req: NextRequest,
  { params }: { params: { commentId: string } },
) {
  try {
    const { userId } = await req.json();
    const { commentId } = params;

    const like = await prisma.commentLike.create({
      data: {
        commentId,
        userId,
      },
    });

    return NextResponse.json(like, { status: 201 });
  } catch (error) {
    console.error("Failed to like comment: ", error);
    return NextResponse.json(
      { error: "Failed to like comment", details: error },
      { status: 500 },
    );
  }
}

// Unlike a comment

export async function DELETE(
  req: NextRequest,
  { params }: { params: { commentId: string } },
) {
  try {
    const { userId } = await req.json();
    const { commentId } = params;

    const like = await prisma.commentLike.findFirst({
      where: {
        commentId,
        userId,
      },
    });

    if (!like) {
      return NextResponse.json(
        { error: "You have not liked this comment" },
        { status: 400 },
      );
    }

    await prisma.commentLike.delete({
      where: {
        id: like.id,
      },
    });

    return NextResponse.json({ message: "Comment unliked" }, { status: 200 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "Database error occurred" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to unlike comment" },
      { status: 500 },
    );
  }
}
