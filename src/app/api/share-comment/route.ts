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

    const { commentId } = await request.json();
    const userId = session.user.id;

    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 },
      );
    }

    // Check if the comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Create a new comment share
    const share = await prisma.commentShare.create({
      data: {
        userId,
        commentId,
      },
    });

    return NextResponse.json(share);
  } catch (error) {
    console.error("Error sharing comment:", error);
    return NextResponse.json(
      { error: "Failed to share comment" },
      { status: 500 },
    );
  }
}
