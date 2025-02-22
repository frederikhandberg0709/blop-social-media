import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/db/prisma";
import argon2 from "argon2";

// Update the user's email

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, password } = body;

    const userId = session.user.id;

    const updatedUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { email: true, password: true },
      });

      if (!user) {
        throw new Error("User not found");
      }
      if (user.email === email) {
        throw new Error("New email matches current email");
      }

      const isPasswordValid = await argon2.verify(user.password, password);

      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }

      const existingUser = await tx.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new Error("Email is already taken by another user");
      }

      return await tx.user.update({
        where: { id: userId },
        data: { email },
        select: {
          id: true,
          email: true,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Email updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      const errorMessages: Record<string, number> = {
        "User not found": 404,
        "New email matches current email": 400,
        "Email is already taken by another user": 400,
      };

      const statusCode = errorMessages[error.message] || 500;
      return NextResponse.json(
        { error: error.message },
        { status: statusCode },
      );
    }

    return NextResponse.json(
      { error: "Failed to update email" },
      { status: 500 },
    );
  }
}
