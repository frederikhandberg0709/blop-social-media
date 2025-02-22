import { FollowParams } from "@/types/api/follow";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { followKeys } from "./followKeys";

interface FollowStatus {
  isFollowing: boolean;
}

export function useFollowStatus({ userId }: FollowParams) {
  const session = useSession();

  return useQuery<FollowStatus, Error>({
    queryKey: followKeys.single({ userId }),

    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/follow-status`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Error fetching follow status: ${response.statusText}`,
        );
      }

      return response.json();
    },

    enabled: Boolean(session),
    staleTime: 30 * 1000,
  });
}
