import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } },
) {
  const postId = params.postId;

  try {
    const revisions = await prisma.postRevision.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
      include: {
        post: true,
      },
    });

    return NextResponse.json(revisions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch post revisions" },
      { status: 500 },
    );
  }
}
