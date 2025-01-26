import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface LikesData {
  likesCount: number;
  userLiked: boolean;
}

export const usePostLikes = (postId: string) => {
  const session = useSession();
  const userId = session?.data?.user?.id;

  return useQuery<LikesData>({
    queryKey: ["postLikes", postId, userId],

    queryFn: async () => {
      const url = new URL("api/likes-count-post", window.location.origin);
      url.searchParams.append("postId", postId);

      if (userId) {
        url.searchParams.append("userId", userId);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Error fetching likes: ${response.statusText}`);
      }

      return response.json();
    },

    enabled: Boolean(postId),

    staleTime: 3000,
    refetchOnWindowFocus: false,

    placeholderData: {
      likesCount: 0,
      userLiked: false,
    },
  });
};

export const useCommentLikes = (commentId: string) => {
  const session = useSession();
  const userId = session?.data?.user?.id;

  return useQuery<LikesData>({
    queryKey: ["commentLikes", commentId, userId],

    queryFn: async () => {
      const url = new URL("api/likes-count-comment", window.location.origin);
      url.searchParams.append("commentId", commentId);

      if (userId) {
        url.searchParams.append("userId", userId);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Error fetching likes: ${response.statusText}`);
      }

      return response.json();
    },

    enabled: Boolean(commentId),

    staleTime: 3000,
    refetchOnWindowFocus: false,

    placeholderData: {
      likesCount: 0,
      userLiked: false,
    },
  });
};
