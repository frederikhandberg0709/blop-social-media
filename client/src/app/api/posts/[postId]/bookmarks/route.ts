import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/db/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Check if post is bookmarked

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { postId } = await params;
    const userId = session.user.id;

    const bookmark = await prisma.bookmark.findFirst({
      where: {
        postId,
        userId,
      },
    });

    return NextResponse.json({
      isBookmarked: !!bookmark,
      bookmarkId: bookmark?.id || null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check bookmark status" },
      { status: 500 },
    );
  }
}
