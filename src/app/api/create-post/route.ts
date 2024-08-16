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

    // Extract quoted post IDs from the content
    const quotedPostIds = extractQuotedPostIds(content);

    // Use a transaction to ensure all operations are performed atomically
    const post = await prisma.$transaction(async (prisma) => {
      // Create the new post
      const newPost = await prisma.post.create({
        data: {
          userId,
          title,
          content: content,
        },
      });

      // Create QuotedPost entries and update quote counts
      if (quotedPostIds.length > 0) {
        await Promise.all(
          quotedPostIds.map(async (quotedPostId: string) => {
            await prisma.quotedPost.create({
              data: {
                quotedPostId: quotedPostId,
                quotingPostId: newPost.id,
              },
            });

            await prisma.post.update({
              where: { id: quotedPostId },
              data: { quoteCount: { increment: 1 } },
            });
          }),
        );
      }

      return newPost;
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function extractQuotedPostIds(content: string): string[] {
  const regex = /\/post\/([a-zA-Z0-9]+)/g;
  const matches = content.matchAll(regex);
  return Array.from(matches, (m) => m[1]);
}
