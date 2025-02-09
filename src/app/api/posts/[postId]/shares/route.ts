import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";

// Check share status and count

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

// Share post

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { postId } = await request.json();
    const userId = session.user.id;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Create a new post share
    const share = await prisma.postShare.create({
      data: {
        userId,
        postId,
      },
    });

    // Fetch the updated share count
    const sharesCount = await prisma.postShare.count({
      where: { postId },
    });

    return NextResponse.json({ share, sharesCount }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to share post" },
      { status: 500 },
    );
  }
}

// Unshare post

export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user.id;
    const { postId } = params;

    const share = await prisma.postShare.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (!share) {
      return NextResponse.json(
        { error: "You haven't shared this post" },
        { status: 400 },
      );
    }

    // Delete the share
    await prisma.postShare.delete({
      where: { id: share.id },
    });

    const sharesCount = await prisma.postShare.count({
      where: { postId },
    });

    return NextResponse.json(
      { message: "Post unshared successfully", sharesCount },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to unshare post" },
      { status: 500 },
    );
  }
}
