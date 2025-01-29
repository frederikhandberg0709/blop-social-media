import { CommentProps } from "@/types/CommentProps";
import { useQuery } from "@tanstack/react-query";

interface Comment extends CommentProps {}

interface CommentsResponse {
  comments: Comment[];
}

export const useCommentQueries = (postId: string) => {
  return useQuery<CommentsResponse, Error>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const response = await fetch(`api/fetch-all-comments?postId=${postId}`);

      if (!response.ok) {
        throw new Error(`Error fetching comments: ${response.statusText}`);
      }

      return response.json();
    },

    placeholderData: {
      comments: [],
    },
  });
};
