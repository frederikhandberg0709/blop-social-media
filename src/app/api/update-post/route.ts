import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const { postId, title, content } = await req.json();

  if (!postId || !content) {
    return NextResponse.json(
      { error: "Post ID and content are required" },
      { status: 400 }
    );
  }

  try {
    // Fetch the current post
    const currentPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!currentPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Create a new post revision
    await prisma.postRevision.create({
      data: {
        postId,
        title: currentPost.title,
        content: currentPost.content,
      },
    });

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}
