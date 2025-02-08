import { CreateCommentParams } from "@/types/api/comments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useCreateComment() {
  const session = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      parentId,
      title,
      content,
    }: CreateCommentParams) => {
      if (!session.data?.user?.id) {
        throw new Error("You need to be logged in to publish a comment");
      }

      const response = await fetch(`/api/send-comment/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentId,
          title,
          content,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to publish comment");
      }

      return response.json();
    },

    onMutate: async (newComment: CreateCommentParams) => {
      const queryKey = ["comments", newComment.postId];
      await queryClient.cancelQueries({ queryKey });

      const previousComments = queryClient.getQueryData<Comment[]>(queryKey);

      if (previousComments) {
        queryClient.setQueryData(queryKey, [
          ...previousComments,
          {
            id: `temp-${Date.now()}`,
            postId: newComment.postId,
            parentId: newComment.parentId,
            userId: session.data?.user?.id,
            title: newComment.title,
            content: newComment.content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: session.data?.user,
          },
        ]);
      }

      return { previousComments };
    },

    onError: (error, newComment, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", newComment.postId],
          context.previousComments,
        );
      }
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
    },
  });
}
