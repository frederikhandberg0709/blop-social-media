import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("Received link account request");

  try {
    const { currentUserId, linkedUserId } = await req.json();
    console.log("Current User ID:", currentUserId);
    console.log("Linked User ID:", linkedUserId);

    if (!currentUserId || !linkedUserId) {
      console.error("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (currentUserId === linkedUserId) {
      console.error("Attempt to link account to itself");
      return NextResponse.json(
        { error: "Cannot link account to itself" },
        { status: 400 },
      );
    }

    console.log("Verifying user existence");
    const [currentUser, linkedUser] = await Promise.all([
      prisma.user.findUnique({ where: { id: currentUserId } }),
      prisma.user.findUnique({ where: { id: linkedUserId } }),
    ]);

    if (!currentUser || !linkedUser) {
      console.error("One or both users do not exist");
      return NextResponse.json(
        { error: "One or both users do not exist" },
        { status: 400 },
      );
    }

    console.log("Checking for existing link");
    const existingLink = await prisma.linkedAccount.findFirst({
      where: {
        OR: [
          { userId: currentUserId, linkedUserId: linkedUserId },
          { userId: linkedUserId, linkedUserId: currentUserId },
        ],
      },
    });

    if (existingLink) {
      console.log("Accounts are already linked");
      return NextResponse.json(
        { error: "Accounts are already linked" },
        { status: 400 },
      );
    }

    console.log("Creating bidirectional link");
    const [link1, link2] = await prisma.$transaction([
      prisma.linkedAccount.create({
        data: {
          userId: currentUserId,
          linkedUserId: linkedUserId,
        },
      }),
      prisma.linkedAccount.create({
        data: {
          userId: linkedUserId,
          linkedUserId: currentUserId,
        },
      }),
    ]);

    console.log("Linked accounts created:", { link1, link2 });

    return NextResponse.json({ link1, link2 });
  } catch (error) {
    console.error("Error linking account:", error);
    return NextResponse.json(
      { error: "Failed to link account", details: (error as Error).message },
      { status: 500 },
    );
  }
}
