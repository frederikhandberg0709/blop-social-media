import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function POST(req: NextRequest) {
  const { userId, color } = await req.json();

  if (!userId || !color) {
    return NextResponse.json(
      { error: "User ID and chosen color are required" },
      { status: 400 }
    );
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { color },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
