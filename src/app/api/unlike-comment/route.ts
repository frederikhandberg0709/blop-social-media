import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { commentId, userId } = await req.json();

    const like = await prisma.commentLike.findFirst({
      where: {
        commentId,
        userId,
      },
    });

    if (!like) {
      return NextResponse.json(
        { error: "You have not liked this comment" },
        { status: 400 },
      );
    }

    await prisma.commentLike.delete({
      where: {
        id: like.id,
      },
    });

    return NextResponse.json({ message: "Comment unliked" }, { status: 200 });
  } catch (error) {
    console.error("Failed to unlike comment: ", error);
    return NextResponse.json(
      { error: "Failed to unlike comment", details: error },
      { status: 500 },
    );
  }
}
