import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("Fetching post with ID:", params.id);
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        user: true,
      },
    });

    console.log("Fetched post:", post);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    const err = error as Error;
    console.error("Error fetching post:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
