import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface LikeActionParams {
  id: string;
  action: "like" | "unlike";
}

interface LikeResponse {
  success: boolean;
  likesCount: number;
  userLiked: boolean;
}

export function usePostLikeMutation() {
  const session = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, action }: LikeActionParams) => {
      if (!session.data?.user?.id) {
        throw new Error("You need to be logged in to like and unlike posts");
      }

      const endpoint =
        action === "like" ? "/api/like-post" : "/api/unlike-post";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: id,
          userId: session.data.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} post`);
      }

      return response.json();
    },

    onMutate: async ({ id, action }) => {
      await queryClient.cancelQueries({ queryKey: ["postLikes", id] });

      const previousData = queryClient.getQueryData<LikeResponse>([
        "postLikes",
        id,
      ]);

      if (previousData) {
        queryClient.setQueryData(["postLikes", id], {
          ...previousData,
          likesCount:
            action === "like"
              ? previousData.likesCount + 1
              : previousData.likesCount - 1,
          userLiked: action === "like",
        });
      }

      return { previousData };
    },

    onError: (error, { id }, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["postLikes", id], context.previousData);
      }

      alert(error instanceof Error ? error.message : "An error occurred");
    },

    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["postLikes", id] });
    },
  });
}

export const useCommentLikeMutation = () => {
  const session = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, action }: LikeActionParams) => {
      if (!session.data?.user?.id) {
        throw new Error("You need to be logged in to like and unlike comments");
      }

      const endpoint =
        action === "like" ? "/api/like-comment" : "/api/unlike-comment";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId: id,
          userId: session.data.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} comment`);
      }

      return response.json();
    },

    onMutate: async ({ id, action }) => {
      await queryClient.cancelQueries({ queryKey: ["commentLikes", id] });

      const previousData = queryClient.getQueryData<LikeResponse>([
        "commentLikes",
        id,
      ]);

      if (previousData) {
        queryClient.setQueryData(["commentLikes", id], {
          ...previousData,
          likesCount:
            action === "like"
              ? previousData.likesCount + 1
              : previousData.likesCount - 1,
          userLiked: action === "like",
        });
      }

      return { previousData };
    },

    onError: (error, { id }, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["commentLikes", id], context.previousData);
      }
      alert(error instanceof Error ? error.message : "An error occurred");
    },

    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["commentLikes", id] });
    },
  });
};
