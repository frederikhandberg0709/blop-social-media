import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user.id;

    const postId = request.nextUrl.searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 },
      );
    }

    const share = await prisma.postShare.findFirst({
      where: { userId, postId },
    });

    const sharesCount = await prisma.postShare.count({
      where: { postId },
    });

    return NextResponse.json({
      hasShared: !!share,
      shareId: share?.id || null,
      sharesCount,
    });
  } catch (error) {
    console.error("Error checking share status:", error);
    return NextResponse.json(
      { error: "Failed to check share status" },
      { status: 500 },
    );
  }
}
