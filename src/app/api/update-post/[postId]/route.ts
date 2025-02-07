import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

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
