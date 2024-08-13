import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user.id;

    const { shareId } = await request.json();

    if (!shareId) {
      return NextResponse.json(
        { error: "Share ID is required" },
        { status: 400 },
      );
    }

    // Check if the share exists and belongs to the current user
    const share = await prisma.postShare.findUnique({
      where: { id: shareId, userId: userId },
    });

    if (!share) {
      return NextResponse.json(
        { error: "Share not found or you're not authorized to unshare" },
        { status: 404 },
      );
    }

    // Delete the share
    await prisma.postShare.delete({
      where: { id: shareId },
    });

    return NextResponse.json({ message: "Post unshared successfully" });
  } catch (error) {
    console.error("Error unsharing post:", error);
    return NextResponse.json(
      { error: "Failed to unshare post" },
      { status: 500 },
    );
  }
}
