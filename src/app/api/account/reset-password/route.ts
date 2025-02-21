import { prisma } from "@/db/prisma";
import argon2 from "argon2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { identifier, newPassword } = await request.json();

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No user found with this email or username" },
        { status: 404 },
      );
    }

    const hashedPassword = await argon2.hash(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password reset error:", error);
    const err = error as Error;
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 },
    );
  }
}
