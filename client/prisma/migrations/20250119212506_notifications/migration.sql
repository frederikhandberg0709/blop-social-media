-- CreateEnum
CREATE TYPE "NotificationTypes" AS ENUM ('NEW_POST', 'REPLY');

-- CreateEnum
CREATE TYPE "NotificationSettingType" AS ENUM ('ALL', 'SPECIFIC', 'DISABLE');

-- CreateTable
CREATE TABLE "notification_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "notificationType" "NotificationTypes" NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewedAt" TIMESTAMPTZ,
    "metaData" JSONB,

    CONSTRAINT "notification_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetProfileId" TEXT NOT NULL,
    "notificationType" "NotificationSettingType" NOT NULL DEFAULT 'ALL',
    "notifyNewPosts" BOOLEAN NOT NULL DEFAULT true,
    "notifyReplies" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "notification_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notification_history_userId_createdAt_idx" ON "notification_history"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "notification_history_fromUserId_idx" ON "notification_history"("fromUserId");

-- CreateIndex
CREATE INDEX "notification_settings_userId_idx" ON "notification_settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_settings_userId_targetProfileId_key" ON "notification_settings"("userId", "targetProfileId");

-- AddForeignKey
ALTER TABLE "notification_history" ADD CONSTRAINT "notification_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_history" ADD CONSTRAINT "notification_history_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_settings" ADD CONSTRAINT "notification_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_settings" ADD CONSTRAINT "notification_settings_targetProfileId_fkey" FOREIGN KEY ("targetProfileId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
