import { FollowParams, FollowResponse } from "@/types/api/follow";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { followKeys } from "./followKeys";

export function useDeleteFollow() {
  const session = useSession();
  const queryClient = useQueryClient();

  return useMutation<FollowResponse, Error, FollowParams>({
    mutationFn: async ({ userId }) => {
      if (!session.data?.user?.id) {
        throw new Error("You need to be logged in to unfollow users");
      }

      const response = await fetch(`/api/users/${userId}/follow`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to unfollow user");
      }

      return response.json();
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: followKeys.single({ userId: variables.userId }),
      });
      queryClient.invalidateQueries({
        queryKey: followKeys.followers(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: followKeys.following(session.data?.user?.id!),
      });
    },
  });
}
