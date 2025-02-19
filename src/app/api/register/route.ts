import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import argon2 from "argon2";

const validateUsername = (username: string) => {
  const regex = /^[a-z0-9-_]+$/; // Only lowercase letters, numbers, dash, and underscore
  return regex.test(username);
};

const validatePassword = (password: string) => {
  // Password must be at least 8 characters long and contain at least one special character
  const regex =
    /^(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}$/;
  return regex.test(password);
};

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json();

    console.log({ email, password });

    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "Email, username, and password are required" },
        { status: 400 },
      );
    }

    if (!validateUsername(username)) {
      return NextResponse.json(
        {
          error:
            "Username can only contain lowercase letters, numbers, dashes, and underscores",
        },
        { status: 400 },
      );
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters long and contain at least one special character",
        },
        { status: 400 },
      );
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 },
      );
    }

    const hashedPassword = await argon2.hash(password);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", user },
      { status: 201 },
    );
  } catch (e) {
    console.error("Registration error:", e);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 },
    );
  }
}
