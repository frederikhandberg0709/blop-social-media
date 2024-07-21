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
    // do validation here...
    // for instance, check if email is valid, password is strong enough (password critierias: min. 8 character, min. one special character, etc.), etc.
    // can use Zod library for validation

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
    });

    // res.status(201).json(user);
  } catch (e) {
    console.log({ e });
  }

  return NextResponse.json({ message: "success" });
}
