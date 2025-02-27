import { useEffect } from "react";
import NotificationsList from "./NotificationsList";
import { useNotifications } from "@/hooks/api/notifications/useNotifications";
import { useSession } from "next-auth/react";
import { initSocket } from "@/lib/socket";
import { useQueryClient } from "@tanstack/react-query";

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

  if (!session?.user?.id) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between px-[20px]">
        <div className="flex items-center gap-[10px]">
          <h1 className="text-[15px] font-bold text-white/50">NOTIFICATIONS</h1>
        </div>
        <div className="flex items-center gap-2"></div>
      </div>

      <NotificationsList
        notifications={notifications}
        isLoading={isNotificationsPending}
        markAsRead={markAsRead}
      />
    </div>
  );
};

export default NotificationPanel;
