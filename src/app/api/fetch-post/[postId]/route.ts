import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ postId: string }> },
) {
  const params = await props.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
      include: {
        user: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const postWithCounts = {
      ...post,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      _count: undefined,
    };

    return NextResponse.json(postWithCounts, { status: 200 });
  } catch (error) {
    const err = error as Error;
    console.error("Error fetching post:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
