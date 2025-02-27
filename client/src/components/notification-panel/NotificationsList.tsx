import { Notification } from "@/types/components/notification";
import NotificationItem from "./NotificationItem";
import { Loader2 } from "lucide-react";

interface NotificationsListProps {
  notifications: Notification[];
  isLoading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
}

const NotificationsList = ({
  notifications,
  isLoading,
  markAsRead,
}: NotificationsListProps) => {
  return (
    <div className="mt-4 flex flex-col space-y-2">
      {isLoading && (
        <div className="flex items-center justify-center gap-2">
          <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full font-bold">
            <Loader2 className="animate-spin" />
          </div>
          <p className="text-sm">Loading notifications...</p>
        </div>
      )}

      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          markAsRead={markAsRead}
        />
      ))}
    </div>
  );
};

export default NotificationsList;
