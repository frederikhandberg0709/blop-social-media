import { PostResponse } from "@/types/api/posts";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface DeletePostData {
  userId: string | undefined;
  postId: string;
}

export function useDeletePost() {
  const session = useSession();

  return useMutation<PostResponse, Error, DeletePostData, unknown>({
    mutationFn: async ({ userId, postId }) => {
      if (!session.data?.user?.id) {
        throw new Error("You need to be logged in to delete posts");
      }

      const response = await fetch(`/api/posts/?postId=${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete post");
      }

      return response.json();
    },

    onError: (error) => {
      console.error("Error deleting post:", error);
    },
  });
}
