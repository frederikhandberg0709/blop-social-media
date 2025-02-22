import { prisma } from "@/db/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

// Get all linked accounts

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    const linkedAccounts = await prisma.linkedAccount.findMany({
      where: {
        OR: [{ userId: userId }, { linkedUserId: userId }],
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profileName: true,
            profilePicture: true,
          },
        },
        linkedUser: {
          select: {
            id: true,
            username: true,
            profileName: true,
            profilePicture: true,
          },
        },
      },
    });

    // Process the results to get a unique list of linked users
    const uniqueLinkedUsers = linkedAccounts.reduce((acc, link) => {
      const linkedUser = link.userId === userId ? link.linkedUser : link.user;
      if (!acc.some((user) => user.id === linkedUser.id)) {
        acc.push(linkedUser);
      }
      return acc;
    }, [] as any[]);

    return NextResponse.json(uniqueLinkedUsers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch linked accounts" },
      { status: 500 },
    );
  }
}

// Link two accounts

export async function POST(request: NextRequest) {
  try {
    const { currentUserId, linkedUserId } = await request.json();

    if (!currentUserId || !linkedUserId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (currentUserId === linkedUserId) {
      return NextResponse.json(
        { error: "Cannot link account to itself" },
        { status: 400 },
      );
    }

    const [currentUser, linkedUser] = await Promise.all([
      prisma.user.findUnique({ where: { id: currentUserId } }),
      prisma.user.findUnique({ where: { id: linkedUserId } }),
    ]);

    if (!currentUser || !linkedUser) {
      return NextResponse.json(
        { error: "One or both users do not exist" },
        { status: 400 },
      );
    }

    const existingLink = await prisma.linkedAccount.findFirst({
      where: {
        OR: [
          { userId: currentUserId, linkedUserId: linkedUserId },
          { userId: linkedUserId, linkedUserId: currentUserId },
        ],
      },
    });

    if (existingLink) {
      return NextResponse.json(
        { error: "Accounts are already linked" },
        { status: 400 },
      );
    }

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

    return NextResponse.json({ link1, link2 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to link account", details: (error as Error).message },
      { status: 500 },
    );
  }
}
