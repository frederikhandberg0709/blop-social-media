import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function GET(req: NextRequest) {
  const followerId = req.nextUrl.searchParams.get("followerId");
  const followingId = req.nextUrl.searchParams.get("followingId");

  if (!followerId || !followingId) {
    return NextResponse.json(
      { error: "Both followerId and followingId are required" },
      { status: 400 }
    );
  }

  try {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: followingId,
        },
      },
    });

    return NextResponse.json({ isFollowing: !!follow }, { status: 200 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
