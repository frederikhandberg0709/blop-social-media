import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    const revisions = await prisma.postRevision.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(revisions, { status: 200 });
  } catch (error) {
    console.error("Error fetching post revisions:", error);
    return NextResponse.json(
      { error: "Failed to fetch post revisions" },
      { status: 500 }
    );
  }
}
