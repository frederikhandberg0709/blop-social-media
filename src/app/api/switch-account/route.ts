import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { linkedAccountId } = await req.json();
    const currentUserId = session.user.id;

    if (!linkedAccountId) {
      return NextResponse.json(
        { error: "Linked account ID is required" },
        { status: 400 },
      );
    }

    // Verify that the account is indeed linked to the current user
    const linkedAccount = await prisma.linkedAccount.findFirst({
      where: {
        OR: [
          { userId: currentUserId, linkedUserId: linkedAccountId },
          { userId: linkedAccountId, linkedUserId: currentUserId },
        ],
      },
    });

    if (!linkedAccount) {
      return NextResponse.json(
        { error: "Account is not linked" },
        { status: 400 },
      );
    }

    // Fetch the linked user's data
    const linkedUser = await prisma.user.findUnique({
      where: { id: linkedAccountId },
      select: {
        id: true,
        username: true,
        email: true,
        profileName: true,
        profilePicture: true,
        profileBanner: true,
        color: true,
      },
    });

    if (!linkedUser) {
      return NextResponse.json(
        { error: "Linked user not found" },
        { status: 404 },
      );
    }

    // Return the linked user's data
    return NextResponse.json(linkedUser);
  } catch (error) {
    console.error("Error switching account:", error);
    return NextResponse.json(
      { error: "Failed to switch account" },
      { status: 500 },
    );
  }
}
