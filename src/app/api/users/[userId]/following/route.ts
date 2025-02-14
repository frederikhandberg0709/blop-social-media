import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

// Gets the list of all users that a specific user follows

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            profileName: true,
            profilePicture: true,
          },
        },
      },
    });

    if (!following.length) {
      return NextResponse.json([]);
    }

    const followingUsers = following.map((f) => f.following);

    return NextResponse.json(followingUsers);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
