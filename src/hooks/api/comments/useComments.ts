import { CommentsResponse } from "@/types/api/comments";
import { useQuery } from "@tanstack/react-query";

export function useComments(postId: string) {
  return useQuery<CommentsResponse, Error>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${postId}/comments`);

      if (!response.ok) {
        throw new Error(`Error fetching comments: ${response.statusText}`);
      }

      return response.json();
    },

    placeholderData: {
      comments: [],
    },
  });
}
