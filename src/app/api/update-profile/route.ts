import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function POST(req: NextRequest) {
  const { userId, profileName, username, bio, profileBanner } =
    await req.json();

  if (!userId || !username) {
    return NextResponse.json(
      { error: "User ID and username are required" },
      { status: 400 }
    );
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        profileName,
        username,
        bio,
        profileBanner,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
