import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function POST(req: NextRequest) {
  const { userId, ...updateData } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  // const { userId, profileName, username, bio, profilePicture, profileBanner } =
  //   await req.json();

  // if (!userId || !username) {
  //   return NextResponse.json(
  //     { error: "User ID and username are required" },
  //     { status: 400 },
  //   );
  // }

  // try {
  //   const updatedUser = await prisma.user.update({
  //     where: { id: userId },
  //     data: {
  //       profileName,
  //       username,
  //       bio,
  //       profilePicture,
  //       profileBanner,
  //     },
  //   });

  //   return NextResponse.json(updatedUser, { status: 200 });
  // } catch (error) {
  //   const err = error as Error;
  //   return NextResponse.json({ error: err.message }, { status: 500 });
  // }
}
