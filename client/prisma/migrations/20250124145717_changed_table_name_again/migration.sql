/*
  Warnings:

  - You are about to drop the `notification_settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "notification_settings" DROP CONSTRAINT "notification_settings_targetProfileId_fkey";

-- DropForeignKey
ALTER TABLE "notification_settings" DROP CONSTRAINT "notification_settings_userId_fkey";

-- DropTable
DROP TABLE "notification_settings";

-- CreateTable
CREATE TABLE "profile_notification_settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetProfileId" TEXT NOT NULL,
    "notificationType" "NotificationSettingType" NOT NULL DEFAULT 'ALL',
    "notifyNewPosts" BOOLEAN NOT NULL DEFAULT true,
    "notifyReplies" BOOLEAN NOT NULL DEFAULT true,
    "notifyShares" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "profile_notification_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "profile_notification_settings_userId_idx" ON "profile_notification_settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "profile_notification_settings_userId_targetProfileId_key" ON "profile_notification_settings"("userId", "targetProfileId");

-- AddForeignKey
ALTER TABLE "profile_notification_settings" ADD CONSTRAINT "profile_notification_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_notification_settings" ADD CONSTRAINT "profile_notification_settings_targetProfileId_fkey" FOREIGN KEY ("targetProfileId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
