import { prisma } from "@/db/prisma";
import { ProfileNotificationSettingsProps } from "@/types/NotificationProps";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as ProfileNotificationSettingsProps;

    if (!isValidNotificationSettings(body)) {
      return NextResponse.json(
        { error: "Invalid notification settings format" },
        { status: 400 },
      );
    }

    await prisma.profileNotificationSettings.upsert({
      where: {
        userId_targetProfileId: {
          userId: session.user.id,
          targetProfileId: body.targetProfileId,
        },
      },
      create: {
        userId: session.user.id,
        targetProfileId: body.targetProfileId,
        notificationType: body.mainOption.toUpperCase() as
          | "ALL"
          | "SPECIFIC"
          | "DISABLE",
        notifyNewPosts: body.newPost,
        notifyReplies: body.reply,
        notifyShares: body.share,
      },
      update: {
        notificationType: body.mainOption.toUpperCase() as
          | "ALL"
          | "SPECIFIC"
          | "DISABLE",
        notifyNewPosts: body.newPost,
        notifyReplies: body.reply,
        notifyShares: body.share,
      },
    });

    return NextResponse.json(
      { message: "Notification settings saved successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to save notification settings");
    return NextResponse.json(
      { error: "Failed to save notification settings" },
      { status: 500 },
    );
  }
}

function isValidNotificationSettings(
  settings: any,
): settings is ProfileNotificationSettingsProps {
  const validMainOptions = ["all", "specific", "disable"];

  return (
    typeof settings === "object" &&
    settings !== null &&
    validMainOptions.includes(settings.mainOption) &&
    typeof settings.newPost === "boolean" &&
    typeof settings.reply === "boolean" &&
    typeof settings.share === "boolean"
  );
}
