import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/db/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: { post: true, comment: true },
    });
    return NextResponse.json(bookmarks);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { postId, commentId } = await req.json();

  if (!postId && !commentId) {
    return NextResponse.json(
      { error: "Either postId or commentId is required" },
      { status: 400 },
    );
  }

  try {
    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        postId,
        commentId,
      },
    });
    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create bookmark" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Bookmark ID is required" },
      { status: 400 },
    );
  }

  try {
    await prisma.bookmark.delete({
      where: { id: String(id), userId },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 },
    );
  }
}
