import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } },
) {
  const postId = params.postId;

  try {
    const history = await prisma.postRevision.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
      include: {
        post: true,
      },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching post history:", error);
    return NextResponse.json(
      { error: "Failed to fetch post history" },
      { status: 500 },
    );
  }
}
