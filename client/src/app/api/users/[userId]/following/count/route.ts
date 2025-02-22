import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const { userId } = params;

  try {
    const count = await prisma.follow.count({
      where: { followerId: userId },
    });

    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch following count" },
      { status: 500 },
    );
  }
}
