import {
  ShareMutationContext,
  ShareParams,
  ShareResponse,
  ShareStatus,
} from "@/types/api/shares";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { shareKeys } from "./keys";

export function useDeleteShare() {
  const session = useSession();
  const queryClient = useQueryClient();

  return useMutation<ShareResponse, Error, ShareParams, ShareMutationContext>({
    mutationFn: async ({ id, shareId, type }: ShareParams) => {
      if (!session.data?.user?.id) {
        throw new Error(`You need to be logged in to unshare ${type}s`);
      }

      const endpoint = `/api/${type}s/${id}/shares`;

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [type === "post" ? "postId" : "commentId"]: id,
          shareId,
          userId: session.data.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to share ${type}`);
      }

      return response.json();
    },

    onMutate: async (params: ShareParams) => {
      const userId = session.data?.user?.id;
      if (!userId) return;

      const queryKey = shareKeys.single(params);
      const statusKey = shareKeys.status(params, userId);
      const countKey = shareKeys.count(params);

      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: statusKey });
      await queryClient.cancelQueries({ queryKey: countKey });

      const previousStatus = queryClient.getQueryData<ShareStatus>(statusKey);
      const previousCount = queryClient.getQueryData<{ sharesCount: number }>(
        countKey,
      );

      if (previousStatus) {
        queryClient.setQueryData(statusKey, {
          ...previousStatus,
          hasShared: false,
          sharesCount: previousStatus.sharesCount - 1,
        });
      }

      if (previousCount) {
        queryClient.setQueryData(countKey, {
          sharesCount: previousCount.sharesCount - 1,
        });
      }

      return { previousStatus, previousCount };
    },

    onError: (error, params, context?: ShareMutationContext) => {
      if (!session.data?.user?.id) return;

      if (context?.previousStatus) {
        queryClient.setQueryData(
          shareKeys.status(params, session.data.user.id),
          context.previousStatus,
        );
      }

      if (context?.previousCount) {
        queryClient.setQueryData(
          shareKeys.count(params),
          context.previousCount,
        );
      }

      alert(error instanceof Error ? error.message : "An error occurred");
    },

    onSettled: (_, __, params) => {
      if (!session.data?.user?.id) return;

      queryClient.invalidateQueries({
        queryKey: shareKeys.single(params),
      });
      queryClient.invalidateQueries({
        queryKey: shareKeys.status(params, session.data.user.id),
      });
      queryClient.invalidateQueries({
        queryKey: shareKeys.count(params),
      });
    },
  });
}
