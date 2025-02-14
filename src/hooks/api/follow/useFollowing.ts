import { FollowingUser, FollowParams } from "@/types/api/follow";
import { useQuery } from "@tanstack/react-query";
import { followKeys } from "@/hooks/api/follow/followKeys";

export function useFollowing({ userId }: FollowParams) {
  return useQuery({
    queryKey: followKeys.following(userId),

    queryFn: async (): Promise<FollowingUser[]> => {
      const response = await fetch(`/api/users/${userId}/following`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Error fetching following: ${response.statusText}`,
        );
      }

      return response.json();
    },

    staleTime: 1000 * 60 * 5,
    retry: 2,
    enabled: Boolean(userId),
  });
}

export function useFollowingCount({ userId }: FollowParams) {
  return useQuery({
    queryKey: followKeys.followingCount(userId),
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/following/count`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Error fetching following count: ${response.statusText}`,
        );
      }

      return response.json() as Promise<{ count: number }>;
    },
    enabled: Boolean(userId),
  });
}
