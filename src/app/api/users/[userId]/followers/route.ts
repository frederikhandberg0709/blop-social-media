import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

// Gets a list of all followers for a specific user

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            profileName: true,
            profilePicture: true,
          },
        },
      },
    });

    const followerUsers = followers.map((f) => f.follower);

    return NextResponse.json(followerUsers);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
