/*
  Warnings:

  - You are about to drop the `notification_history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profile_notification_settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "notification_history" DROP CONSTRAINT "notification_history_fromUserId_fkey";

-- DropForeignKey
ALTER TABLE "notification_history" DROP CONSTRAINT "notification_history_userId_fkey";

-- DropForeignKey
ALTER TABLE "profile_notification_settings" DROP CONSTRAINT "profile_notification_settings_targetProfileId_fkey";

-- DropForeignKey
ALTER TABLE "profile_notification_settings" DROP CONSTRAINT "profile_notification_settings_userId_fkey";

-- DropTable
DROP TABLE "notification_history";

-- DropTable
DROP TABLE "profile_notification_settings";

-- CreateTable
CREATE TABLE "NotificationHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "notificationType" "NotificationTypes" NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewedAt" TIMESTAMPTZ,
    "metaData" JSONB,

    CONSTRAINT "NotificationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileNotificationSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetProfileId" TEXT NOT NULL,
    "notificationType" "NotificationSettingType" NOT NULL DEFAULT 'ALL',
    "notifyNewPosts" BOOLEAN NOT NULL DEFAULT true,
    "notifyReplies" BOOLEAN NOT NULL DEFAULT true,
    "notifyShares" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "ProfileNotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NotificationHistory_userId_createdAt_idx" ON "NotificationHistory"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "NotificationHistory_fromUserId_idx" ON "NotificationHistory"("fromUserId");

-- CreateIndex
CREATE INDEX "ProfileNotificationSettings_userId_idx" ON "ProfileNotificationSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileNotificationSettings_userId_targetProfileId_key" ON "ProfileNotificationSettings"("userId", "targetProfileId");

-- AddForeignKey
ALTER TABLE "NotificationHistory" ADD CONSTRAINT "NotificationHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationHistory" ADD CONSTRAINT "NotificationHistory_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileNotificationSettings" ADD CONSTRAINT "ProfileNotificationSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileNotificationSettings" ADD CONSTRAINT "ProfileNotificationSettings_targetProfileId_fkey" FOREIGN KEY ("targetProfileId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
