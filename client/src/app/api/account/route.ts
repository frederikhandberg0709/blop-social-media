import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Update a user

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const updateData = await request.json();
    const userId = session.user.id;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Delete a user account

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    await prisma.$transaction(async (tx) => {
      const userPosts = await tx.post.findMany({
        where: { userId },
        select: { id: true },
      });

      const userPostIds = userPosts.map((post) => post.id);

      await tx.quotedPost.deleteMany({
        where: {
          OR: [
            { quotingPostId: { in: userPostIds } },
            { quotedPostId: { in: userPostIds } },
          ],
        },
      });

      await tx.comment.deleteMany({
        where: { userId },
      });

      await tx.follow.deleteMany({
        where: {
          OR: [{ followerId: userId }, { followedUserId: userId }],
        },
      });

      await tx.bookmark.deleteMany({
        where: { userId },
      });

      await tx.postLike.deleteMany({
        where: { userId },
      });

      await tx.commentLike.deleteMany({
        where: { userId },
      });

      await tx.postShare.deleteMany({
        where: { userId },
      });

      await tx.commentShare.deleteMany({
        where: { userId },
      });

      await tx.post.deleteMany({
        where: { userId },
      });

      await tx.linkedAccount.deleteMany({
        where: { userId },
      });

      await tx.user.delete({
        where: { id: userId },
      });
    });

    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
