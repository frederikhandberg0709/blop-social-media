"use client";

import { useNotifications } from "@/hooks/api/notifications/useNotifications";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import {
  Notification,
  NotificationTypes,
} from "@/types/components/notification";
import { initSocket } from "@/lib/socket";
import { useEffect, useState } from "react";
import ProfilePicture from "./ProfilePicture";

const NotificationPanel = () => {
  const { data: session } = useSession();
  const { data: notifications = [], isPending: isNotificationsPending } =
    useNotifications();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!session?.user?.id) return;

    const socket = initSocket();

    socket.on("connect", () => {
      socket.emit("authenticate", session.user.id);
    });

    socket.on("notification", (data) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notificationCount"] });
    });

    return () => {
      socket.disconnect();
    };
  }, [session?.user?.id, queryClient]);

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationIds: [notificationId] }),
      });

      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notificationCount"] });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);

    if (unreadIds.length === 0) return;

    try {
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationIds: unreadIds }),
      });

      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notificationCount"] });
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  if (!session?.user?.id) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between px-[20px]">
        <div className="flex items-center gap-[10px]">
          <h1 className="text-[15px] font-bold text-white/50">NOTIFICATIONS</h1>
          {/* {unreadCount > 0 && (
              <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-red-700 font-bold">
                {unreadCount}
              </div>
            )} */}
        </div>
        <div className="flex items-center gap-2">
          {/* {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-white/50 transition-colors hover:text-white"
            >
              <Check />
            </button>
          )} */}
        </div>
      </div>

      <div className="mt-4 flex flex-col space-y-2">
        {isNotificationsPending && (
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full font-bold">
              <Loader2 className="animate-spin" />
            </div>
            <p className="text-sm">Loading notifications...</p>
          </div>
        )}

        {notifications.map((notification: Notification) => (
          <div
            key={notification.id}
            onClick={() => !notification.isRead && markAsRead(notification.id)}
            className={`px-[20px] py-3 ${
              !notification.isRead ? "bg-white/5" : ""
            } rounded-md transition-colors hover:bg-white/10 active:bg-white/20`}
          >
            <div className="flex gap-3">
              <ProfilePicture
                src={notification.fromUser.profilePicture}
                alt={
                  notification.fromUser.profileName ||
                  notification.fromUser.username
                }
                size={30}
              />

              <div className="flex flex-col">
                <span className="font-bold text-white/90">
                  {notification.fromUser.profileName ||
                    notification.fromUser.username}
                </span>

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
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;
