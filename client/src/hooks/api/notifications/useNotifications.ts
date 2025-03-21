import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useNotifications = () => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["notifications", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const response = await fetch(
        `/api/notifications?userId=${session.user.id}`,
      );
      const notifications = await response.json();

      return notifications;
    },
    enabled: !!session?.user?.id,
  });
};
