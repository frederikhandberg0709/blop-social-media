import { prisma } from "@/db/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { CommentProps } from "@/types/components/comment";

// Get all commments for a post

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } },
) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const { postId } = await params;

  try {
    const allComments = await prisma.comment.findMany({
      where: {
        postId,
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

    const commentMap = new Map();
    const topLevelComments: CommentProps[] = [];

    allComments.forEach((comment) => {
      commentMap.set(comment.id, {
        id: comment.id,
        user: comment.user,
        title: comment.title,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        initialLikesCount: comment._count.likes,
        repliesCount: comment._count.replies,
        userLiked: comment.likes.length > 0,
        children: [],
      });
    });

    allComments.forEach((comment) => {
      const commentObj = commentMap.get(comment.id);

      if (comment.parentId === null) {
        topLevelComments.push(commentObj);
      } else {
        const parentComment = commentMap.get(comment.parentId);
        if (parentComment) {
          parentComment.children.push(commentObj);
        } else {
          console.warn(
            `Parent comment ${comment.parentId} not found for comment ${comment.id}`,
          );
          topLevelComments.push(commentObj);
        }
      }
    });

    return NextResponse.json({ comments: topLevelComments });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

// Create a new comment

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ postId: string }> },
) {
  const params = await props.params;
  const { postId } = params;
  const { parentId, title, content } = await request.json();
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
    return NextResponse.json(
      { error: "Failed to create comment", details: error },
      { status: 500 },
    );
  }
}
