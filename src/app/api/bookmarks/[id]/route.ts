import { prisma } from "@/db/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

// Delete a bookmark

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { id } = await params;

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
