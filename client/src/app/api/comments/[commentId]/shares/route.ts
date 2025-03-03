import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";

// Check share status and count

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user.id;

    const commentId = request.nextUrl.searchParams.get("commentId");
    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 },
      );
    }

    const [share, shares] = await Promise.all([
      prisma.commentShare.findFirst({
        where: {
          commentId,
          userId,
        },
      }),
      prisma.commentShare.count({
        where: {
          commentId,
        },
      }),
    ]);

    return NextResponse.json({
      hasShared: !!share,
      shareId: share?.id || null,
      sharesCount: shares,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check share status" },
      { status: 500 },
    );
  }
}

// Share comment
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

// Unshare comment

export async function DELETE(
  request: NextRequest,
  { params }: { params: { commentId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user.id;
    const { commentId } = params;

    // Find the share
    const share = await prisma.commentShare.findFirst({
      where: {
        commentId,
        userId,
      },
    });

    if (!share) {
      return NextResponse.json(
        { error: "You haven't shared this comment" },
        { status: 400 },
      );
    }

    // Delete the share
    await prisma.commentShare.delete({
      where: { id: share.id },
    });

    // Get updated count
    const sharesCount = await prisma.commentShare.count({
      where: { commentId },
    });

    return NextResponse.json(
      {
        message: "Comment unshared successfully",
        sharesCount,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to unshare comment" },
      { status: 500 },
    );
  }
}
