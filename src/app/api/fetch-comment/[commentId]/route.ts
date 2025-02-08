import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

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
