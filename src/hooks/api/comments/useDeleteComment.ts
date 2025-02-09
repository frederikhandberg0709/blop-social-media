import {
  CommentResponse,
  DeleteCommentContext,
  DeleteCommentParams,
  DeleteCommentResponse,
} from "@/types/api/comments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useDeleteComment() {
  const queryClient = useQueryClient();
  const session = useSession();

  return useMutation<
    DeleteCommentResponse,
    Error,
    DeleteCommentParams,
    DeleteCommentContext
  >({
    mutationFn: async ({ commentId }) => {
      if (!session.data?.user?.id) {
        throw new Error("You need to be logged in to delete comments");
      }

      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete comment");
      }

      return response.json();
    },

    onMutate: async ({ commentId }) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] });

      const queries = queryClient.getQueriesData<CommentResponse>({
        queryKey: ["comments"],
      });

      queries.forEach(([queryKey, oldData]) => {
        if (oldData?.comments) {
          queryClient.setQueryData<CommentResponse>(queryKey, {
            ...oldData,
            comments: oldData.comments.filter(
              (comment) => comment.id !== commentId,
            ),
          });
        }
      });

      return { queries };
    },

    onError: (error, variables, context) => {
      console.error("Error deleting comment:", error);

      if (context?.queries) {
        context.queries.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}
