import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { notificationIds } = await request.json();

    await prisma.notificationHistory.updateMany({
      where: {
        id: {
          in: notificationIds,
        },
      },
      data: {
        isRead: true,
        viewedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to mark notifications as read" },
      { status: 500 },
    );
  }
}
