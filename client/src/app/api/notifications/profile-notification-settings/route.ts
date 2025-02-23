import { prisma } from "@/db/prisma";
import {
  NotificationSettingType,
  ProfileNotificationSettingsProps,
} from "@/types/components/notification";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// export async function GET(req: NextRequest) {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const settings = await prisma.profileNotificationSettings.findMany({
//     where: { userId: session.user.id },
//   });

//   return NextResponse.json(settings, { status: 200 });
// }

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

    if (body.mainOption === NotificationSettingType.DISABLE) {
      await prisma.profileNotificationSettings.deleteMany({
        where: {
          userId: session.user.id,
          targetProfileId: body.targetProfileId,
        },
      });

      return NextResponse.json({ status: "disabled" }, { status: 200 });
    }

    const settings = await prisma.profileNotificationSettings.upsert({
      where: {
        userId_targetProfileId: {
          userId: session.user.id,
          targetProfileId: body.targetProfileId,
        },
      },
      create: {
        userId: session.user.id,
        targetProfileId: body.targetProfileId,
        notificationType: body.mainOption.toUpperCase() as "ALL" | "SPECIFIC",
        notifyNewPosts: body.newPost,
        notifyReplies: body.reply,
        notifyShares: body.share,
      },
      update: {
        notificationType: body.mainOption.toUpperCase() as "ALL" | "SPECIFIC",
        notifyNewPosts: body.newPost,
        notifyReplies: body.reply,
        notifyShares: body.share,
      },
    });

    return NextResponse.json(settings, { status: 200 });
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
  const validMainOptions = [
    NotificationSettingType.ALL,
    NotificationSettingType.SPECIFIC,
    NotificationSettingType.DISABLE,
  ];

  return (
    typeof settings === "object" &&
    settings !== null &&
    validMainOptions.includes(settings.mainOption) &&
    typeof settings.newPost === "boolean" &&
    typeof settings.reply === "boolean" &&
    typeof settings.share === "boolean"
  );
}
