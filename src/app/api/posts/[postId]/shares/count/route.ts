import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

// Get share count for a post

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } },
) {
  try {
    const { postId } = await params;

    const [regularShares, quotes] = await Promise.all([
      prisma.postShare.count({
        where: { postId },
      }),
      prisma.quotedPost.count({
        where: { quotedPostId: postId },
      }),
    ]);

    return NextResponse.json({ sharesCount: regularShares + quotes });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch post share count" },
      { status: 500 },
    );
  }
}
