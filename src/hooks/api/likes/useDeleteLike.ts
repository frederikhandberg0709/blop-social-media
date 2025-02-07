import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { LikeParams, LikeResponse } from "@/types/api/likes";
import { likeKeys } from "./keys";

export function useDeleteLike() {
  const session = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, type }: LikeParams) => {
      if (!session.data?.user?.id) {
        throw new Error(`You need to be logged in to like ${type}`);
      }

      const endpoint = `/api/${type === "post" ? "unlike-post" : "unlike-comment"}`;

      const body = {
        [type === "post" ? "postId" : "commentId"]: id,
        userId: session.data.user.id,
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to like post");
      }

      return response.json();
    },

    onMutate: async (params: LikeParams) => {
      const queryKey = likeKeys.single(params);
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<LikeResponse>([
        params.type,
        params.id,
      ]);

      if (previousData) {
        queryClient.setQueryData(queryKey, {
          ...previousData,
          likesCount: previousData.likesCount + 1,
          userLiked: true,
        });
      }

      return { previousData };
    },

    onError: (error, params: LikeParams, context) => {
      if (context?.previousData) {
        const queryKey = likeKeys.single(params);
        queryClient.setQueryData(queryKey, context.previousData);
      }

      alert(error instanceof Error ? error.message : "An error occurred");
    },

    onSettled: (_, __, params: LikeParams) => {
      const queryKey = likeKeys.single(params);
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
