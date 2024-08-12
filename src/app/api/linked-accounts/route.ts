import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

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
    console.error("Error fetching linked accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch linked accounts" },
      { status: 500 },
    );
  }
}
