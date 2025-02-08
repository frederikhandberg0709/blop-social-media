import { CommentsResponse } from "@/types/api/comments";
import { useQuery } from "@tanstack/react-query";

export function useCommentList(postId: string) {
  return useQuery<CommentsResponse, Error>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const response = await fetch(`/api/fetch-all-comments?postId=${postId}`);

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
