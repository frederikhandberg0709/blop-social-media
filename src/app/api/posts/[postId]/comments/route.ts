import { prisma } from "@/db/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";

// Get all commments for a post

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } },
) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const { postId } = params;

  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null, // Only get top-level comments just for now
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
            likes: {
              where: {
                userId: userId || undefined,
              },
            },
            _count: {
              select: {
                likes: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
          where: {
            userId: userId || undefined,
          },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedComments = comments.map((comment) => ({
      id: comment.id,
      user: comment.user,
      title: comment.title,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      replies: comment.replies.map((reply) => ({
        ...reply,
        initialLikesCount: reply._count.likes,
        userLiked: reply.likes.length > 0,
        _count: undefined,
        likes: undefined,
      })),
      initialLikesCount: comment._count.likes,
      repliesCount: comment._count.replies,
      userLiked: comment.likes.length > 0,
    }));

    return NextResponse.json({ comments: formattedComments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

// Create a new comment

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ postId: string }> },
) {
  const params = await props.params;
  const { postId } = params;
  const { parentId, title, content } = await req.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        postId,
        userId: session.user.id,
        parentId: parentId ?? null,
        title,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(newComment, { status: 200 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment", details: error },
      { status: 500 },
    );
  }
}
