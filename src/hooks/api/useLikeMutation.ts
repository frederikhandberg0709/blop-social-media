import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface LikeActionParams {
  postId: string;
  action: "like" | "unlike";
}

interface LikeResponse {
  success: boolean;
  likesCount: number;
  userLikes: boolean;
}

export function usePostLikeMutation() {
  const session = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, action }: LikeActionParams) => {
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
          postId,
          userId: session.data.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} post`);
      }

      return response.json();
    },

    onMutate: async ({ postId, action }) => {
      await queryClient.cancelQueries({ queryKey: ["postLikes", postId] });

      const previousData = queryClient.getQueryData<LikeResponse>([
        "postLikes",
        postId,
      ]);

      if (previousData) {
        queryClient.setQueryData(["postLikes", postId], {
          ...previousData,
          likesCount:
            action === "like"
              ? previousData.likesCount + 1
              : previousData.likesCount - 1,
        });
      }

      return { previousData };
    },

    onError: (error, { postId }, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["postLikes", postId], context.previousData);
      }

      alert(error instanceof Error ? error.message : "An error occurred");
    },

    onSettled: (_, __, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["postLikes", postId] });
    },
  });
}

// TODO: Mutation to like and unlike a comment
