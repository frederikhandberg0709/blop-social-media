import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { commentId, userId } = await req.json();

    const like = await prisma.commentLike.create({
      data: {
        commentId,
        userId,
      },
    });

    return NextResponse.json(like, { status: 201 });
  } catch (error) {
    console.error("Failed to like comment: ", error);
    return NextResponse.json(
      { error: "Failed to like comment", details: error },
      { status: 500 },
    );
  }
}
