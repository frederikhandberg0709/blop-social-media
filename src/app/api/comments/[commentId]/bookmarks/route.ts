import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/db/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Check if comment is bookmarked

export async function GET(
  request: NextRequest,
  { params }: { params: { commentId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { commentId } = await params;
    const userId = session.user.id;

    const bookmark = await prisma.bookmark.findFirst({
      where: {
        commentId,
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
