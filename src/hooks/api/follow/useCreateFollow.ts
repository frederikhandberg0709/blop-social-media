import { FollowParams, FollowResponse } from "@/types/api/follow";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useCreateFollow() {
  const session = useSession();
  const queryClient = useQueryClient();

  return useMutation<FollowResponse, Error, FollowParams>({
    mutationFn: async ({ userId }) => {
      if (!session.data?.user?.id) {
        throw new Error("You need to be logged in to follow users");
      }

      const response = await fetch(`/api/users/${userId}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to follow user");
      }

      return response.json();
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["followers", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["following", session.data?.user?.id],
      });
    },
  });
}
