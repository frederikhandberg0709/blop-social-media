"use client";

import Link from "next/link";
import {
  Notification,
  NotificationTypes,
} from "@/types/components/notification";
import { useState } from "react";
import ProfilePicture from "../ProfilePicture";
import { formatDate } from "@/utils/formattedDate";

const NotificationItem = ({
  notification,
  markAsRead,
}: {
  notification: Notification;
  markAsRead: (id: string) => Promise<void>;
}) => {
  const [isProfileHovered, setIsProfileHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsProfileHovered(true);
  };

  const handleMouseLeave = () => {
    setIsProfileHovered(false);
  };

  return (
    <div
      onClick={() => !notification.isRead && markAsRead(notification.id)}
      className={`px-[20px] py-3 ${
        !notification.isRead ? "bg-white/5" : ""
      } rounded-md transition-colors hover:bg-white/10 active:bg-white/20`}
    >
      <div className="flex gap-3">
        <Link
          href={`/profile/${notification.fromUser.username}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="h-fit"
        >
          <ProfilePicture
            src={notification.fromUser.profilePicture}
            alt={`${
              notification.fromUser.profileName ||
              notification.fromUser.username
            }'s profile picture`}
            size={30}
          />
        </Link>

        <div className="flex w-full flex-col">
          <div className="flex items-center justify-between">
            <Link
              href={`/profile/${notification.fromUser.username}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="flex items-center gap-2"
            >
              <span
                className={`text-sm font-bold ${
                  isProfileHovered ? "text-blue-500" : "text-gray-200"
                }`}
              >
                {notification.fromUser.profileName ||
                  notification.fromUser.username}
              </span>

              <span className="text-sm text-gray-500">
                {notification.fromUser.username}
              </span>
            </Link>

            <span className="text-sm text-gray-500">
              {formatDate(notification.createdAt)}
            </span>
          </div>

          <span className="text-sm text-white/70">
            {notification.notificationType === NotificationTypes.NEW_POST
              ? "New post published"
              : "Replied to your post"}
          </span>

          {notification.metaData?.postTitle && (
            <p className="mt-1 text-sm text-white/50">
              {notification.metaData.postTitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
