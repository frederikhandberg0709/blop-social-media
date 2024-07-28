import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } },
) {
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
