import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/db/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { targetProfileId: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.profileNotificationSettings.findUnique({
    where: {
      userId_targetProfileId: {
        userId: session.user.id,
        targetProfileId: params.targetProfileId,
      },
    },
  });

  return NextResponse.json(settings, { status: 200 });
}
