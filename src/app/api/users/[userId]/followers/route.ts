import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

// Follow a user

export async function POST(req: NextRequest) {
  const { followerId, followingId } = await req.json();

  try {
    const follow = await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });

    return NextResponse.json(follow, { status: 201 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
