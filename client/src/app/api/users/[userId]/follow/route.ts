import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Follow a user

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const followerId = session.user.id;
  const followedUserId = params.userId;

  try {
    const follow = await prisma.follow.create({
      data: {
        followerId,
        followedUserId,
      },
    });

    return NextResponse.json(follow, { status: 201 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Unfollow a user

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const followerId = session.user.id;
  const followedUserId = params.userId;

  try {
    const unfollow = await prisma.follow.delete({
      where: {
        followerId_followedUserId: {
          followerId,
          followedUserId,
        },
      },
    });

    return NextResponse.json(unfollow, { status: 200 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
