import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// Get a post by ID

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ postId: string }> },
) {
  const params = await props.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
      include: {
        user: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const postWithCounts = {
      ...post,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      _count: undefined,
    };

    return NextResponse.json(postWithCounts, { status: 200 });
  } catch (error) {
    const err = error as Error;
    console.error("Error fetching post:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Update a post by ID

export async function PUT(req: NextRequest) {
  const { postId, title, content } = await req.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!postId || !content) {
    return NextResponse.json(
      { error: "Post ID and content are required" },
      { status: 400 },
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const currentPost = await tx.post.findUnique({
        where: { id: postId },
        include: {
          revisions: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });

      if (!currentPost) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      await prisma.postRevision.create({
        data: {
          postId,
          title: currentPost.title,
          content: currentPost.content,
        },
      });

      await tx.postRevision.create({
        data: {
          postId,
          title: currentPost.title,
          content: currentPost.content,
        },
      });

      return tx.post.update({
        where: { id: postId },
        data: { title, content, updatedAt: new Date() },
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 },
    );
  }
}

// Delete a post by ID

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;
    const postId = request.nextUrl.searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 },
      );
    }

    // Fetch the post to check if the current user is the author
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.userId !== userId) {
      return NextResponse.json(
        { error: "Not authorized to delete this post" },
        { status: 403 },
      );
    }

    // Delete the post
    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 },
    );
  }
}
