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

    const { postId } = await request.json();
    const userId = session.user.id;

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 },
      );
    }

    // Check if the post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Create a new post share
    const share = await prisma.postShare.create({
      data: {
        userId,
        postId,
      },
    });

    // Fetch the updated share count
    const sharesCount = await prisma.postShare.count({
      where: { postId: postId },
    });

    return NextResponse.json({ share, sharesCount });
  } catch (error) {
    console.error("Error sharing post:", error);
    return NextResponse.json(
      { error: "Failed to share post" },
      { status: 500 },
    );
  }
}
