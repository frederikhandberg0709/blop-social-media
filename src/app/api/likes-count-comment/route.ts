import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function GET(req: NextRequest) {
  const commentId = req.nextUrl.searchParams.get("commentId");
  const userId = req.nextUrl.searchParams.get("userId");

  if (!commentId) {
    return NextResponse.json(
      { error: "Comment ID is required" },
      { status: 400 },
    );
  }

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
        userLiked: !!userLiked,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to fetch likes count:", error);

    return NextResponse.json(
      { error: "Failed to fetch likes count" },
      { status: 500 },
    );
  }
}
