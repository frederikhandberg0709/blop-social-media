"use client";

import { initSocket } from "@/lib/socket";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Notification {
  id: string;
  content: string;
  notificationType: "NEW_POST" | "REPLY";
  isRead: boolean;
  createdAt: string;
  metaData: {
    postId: string;
    postTitle: string;
  };
}

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
      });

    const socket = initSocket();

    socket.emit("authenticate", session.user.id);

    socket.on("notification", (newNotification: Notification) => {
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [session]);

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationIds: [notificationId] }),
      });

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
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

      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true })),
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between px-[20px]">
        <div className="flex items-center gap-[10px]">
          <h1 className="text-[15px] font-bold text-white/50">NOTIFICATIONS</h1>
          <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-red-700 font-bold">
            {unreadCount > 0 && (
              <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-red-700 font-bold">
                {unreadCount}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-white/50 transition-colors hover:text-white"
            >
              Mark all as read
            </button>
          )}

          <Link
            href={"#"}
            className="rounded-full fill-white/50 p-[7px] transition duration-150 ease-in-out hover:bg-white/10 hover:fill-white active:fill-blue-500"
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19.5 12c0-.23-.01-.45-.03-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23a.987.987 0 0 0-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-.99-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41a7.343 7.343 0 0 0 0 1.35l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88.99.88h3.73c.5 0 .93-.38.99-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.03-.23.04-.45.04-.68zm-7.46 3.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5z" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="mt-4 flex flex-col space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => !notification.isRead && markAsRead(notification.id)}
            className={`px-[20px] py-3 ${
              !notification.isRead ? "bg-white/5" : ""
            } transition-colors hover:bg-white/10`}
          >
            <p className="text-white/90">{notification.content}</p>
            {notification.metaData?.postTitle && (
              <p className="mt-1 text-sm text-white/50">
                {notification.metaData.postTitle}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;
