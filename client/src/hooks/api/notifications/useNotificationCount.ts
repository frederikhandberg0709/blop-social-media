import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useNotificationCount = () => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["notificationCount", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return 0;

      const response = await fetch(
        `/api/notifications/count?userId=${session.user.id}`,
      );
      const data = await response.json();
      return data.count;
    },
    enabled: !!session?.user?.id,
  });
};
