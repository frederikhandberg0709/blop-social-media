import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const count = await prisma.notificationHistory.count({
      where: {
        userId: userId,
        isRead: false,
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch notification count" },
      { status: 500 },
    );
  }
}
