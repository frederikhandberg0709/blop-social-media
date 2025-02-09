import { prisma } from "@/db/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

// Get a comment by ID

export async function GET(
  req: NextRequest,
  { params }: { params: { commentId: string } },
) {
  const { commentId } = params;

  if (!commentId) {
    return NextResponse.json(
      { error: "Comment ID is required" },
      { status: 400 },
    );
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profileName: true,
            profilePicture: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profileName: true,
                profilePicture: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json(comment, { status: 200 });
  } catch (error) {
    console.error("Error fetching comment:", error);
    return NextResponse.json(
      { error: "Failed to fetch comment" },
      { status: 500 },
    );
  }
}

// Update a comment by ID

export async function PUT(req: NextRequest) {}

// Delete a comment by ID

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
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

    // Fetch the comment to check if the current user is the author
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.userId !== userId) {
      return NextResponse.json(
        { error: "Not authorized to delete this comment" },
        { status: 403 },
      );
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 },
    );
  }
}
