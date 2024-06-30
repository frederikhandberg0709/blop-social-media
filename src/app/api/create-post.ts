import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req: NextRequest) {
  const { userId, title, text } = await req.json();
  try {
    const post = await prisma.post.create({
      data: {
        userId,
        title,
        content: text,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
