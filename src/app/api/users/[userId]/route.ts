import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  // const userId = req.nextUrl.searchParams.get("userId");
  const session = await getServerSession(authOptions);

  // if (!userId) {
  //   return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  // }

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        profileName: true,
        bio: true,
        profilePicture: true,
        profileBanner: true,
        color: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const { userId, profileName, username, bio } = await req.json();

  if (!userId || !username) {
    return NextResponse.json(
      { error: "User ID and username are required" },
      { status: 400 },
    );
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        profileName,
        username,
        bio,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
