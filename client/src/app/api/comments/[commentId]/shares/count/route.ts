// Get share count for a comment

import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { commentId: string } },
) {
  try {
    const { commentId } = params;

    const sharesCount = await prisma.commentShare.count({
      where: { commentId },
    });

    return NextResponse.json({ sharesCount });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch comment share count" },
      { status: 500 },
    );
  }
}
