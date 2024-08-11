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
      where: { userId: userId },
      include: { linkedUser: true },
    });

    const linkedUsers = linkedAccounts.map((account) => account.linkedUser);

    return NextResponse.json(linkedUsers);
  } catch (error) {
    console.error("Error fetching linked accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch linked accounts" },
      { status: 500 },
    );
  }
}
