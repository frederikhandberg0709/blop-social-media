import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get("postId");
  const userId = req.nextUrl.searchParams.get("userId");

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
    console.error("Failed to fetch likes count:", error);

    return NextResponse.json(
      { error: "Failed to fetch likes count" },
      { status: 500 },
    );
  }
}
