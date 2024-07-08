import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get("postId");
  const userId = req.nextUrl.searchParams.get("userId");

  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    const likesCount = await prisma.like.count({
      where: { postId },
    });

    const userLiked = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    return NextResponse.json(
      {
        likesCount,
        userLiked: !!userLiked,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch likes count" },
      { status: 500 }
    );
  }
}
