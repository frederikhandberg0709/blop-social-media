import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function POST(req: NextRequest) {
  const { userId, title, content } = await req.json();

  try {
    // Validate that userId is provided
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Validate that content is present and not empty
    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Content field is mandatory and cannot be empty" },
        { status: 400 },
      );
    }

    const post = await prisma.post.create({
      data: {
        userId,
        title,
        content: content,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
