import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface ShareActionParams {
  id: string;
  action: "share" | "unshare";
}

interface ShareCountResponse {
  sharesCount: number;
}

interface ShareStatusResponse {
  hasShared: boolean;
  shareId: string | null;
  sharesCount: number;
}

interface ShareMutationResponse {
  success: boolean;
  sharesCount: number;
  hasShared: boolean;
  shareId: string | null;
}

export function usePostShareMutation() {
  const session = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, action }: ShareActionParams) => {
      if (!session.data?.user?.id) {
        throw new Error("You need to be logged in to share and unshare posts");
      }

      const endpoint =
        action === "share" ? "/api/share-post" : "/api/unshare-post";

      const currentStatus = queryClient.getQueryData<ShareMutationResponse>([
        "postShareStatus",
        id,
        session.data.user.id,
      ]);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          action === "share"
            ? {
                postId: id,
                userId: session.data.user.id,
              }
            : {
                postId: id,
                shareId: currentStatus?.shareId,
              },
        ),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} post`);
      }

      return response.json();
    },

    onMutate: async ({ id, action }) => {
      await queryClient.cancelQueries({ queryKey: ["postShares", id] });
      await queryClient.cancelQueries({
        queryKey: ["postShareStatus", id, session.data?.user?.id],
      });

      const previousShares = queryClient.getQueryData<ShareCountResponse>([
        "postShares",
        id,
      ]);
      const previousStatus = queryClient.getQueryData<ShareStatusResponse>([
        "postShareStatus",
        id,
        session.data?.user?.id,
      ]);

      if (previousShares) {
        queryClient.setQueryData(["postShares", id], {
          ...previousShares,
          sharesCount:
            action === "share"
              ? previousShares.sharesCount + 1
              : previousShares.sharesCount - 1,
        });
      }

      if (previousStatus) {
        queryClient.setQueryData(
          ["postShareStatus", id, session.data?.user?.id],
          {
            ...previousStatus,
            hasShared: action === "share",
            sharesCount:
              action === "share"
                ? previousStatus.sharesCount + 1
                : previousStatus.sharesCount - 1,
          },
        );
      }

      return { previousShares, previousStatus };
    },

    onError: (error, { id }, context) => {
      if (context?.previousShares) {
        queryClient.setQueryData(["postShares", id], context.previousShares);
      }

      if (context?.previousStatus) {
        queryClient.setQueryData(
          ["postShareStatus", id, session.data?.user?.id],
          context.previousStatus,
        );
      }

      alert(error instanceof Error ? error.message : "An error occurred");
    },

    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["postShares", id] });
      queryClient.invalidateQueries({
        queryKey: ["postShareStatus", id, session.data?.user?.id],
      });
    },
  });
}

export function useCommentShareMutation() {}
