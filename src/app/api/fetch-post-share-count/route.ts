import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    const sharesCount = await prisma.postShare.count({
      where: { postId: postId },
    });

    return NextResponse.json({ sharesCount });
  } catch (error) {
    console.error("Error fetching share count:", error);
    return NextResponse.json(
      { error: "Failed to fetch share count" },
      { status: 500 },
    );
  }
}
