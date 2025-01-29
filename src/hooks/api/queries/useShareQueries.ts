import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface ShareCountResponse {
  sharesCount: number;
}

interface ShareStatusResponse {
  hasShared: boolean;
  shareId: string;
  sharesCount: number;
}

export const usePostShareCount = (postId: string) => {
  return useQuery({
    queryKey: ["postShares", postId],
    queryFn: async () => {
      const response = await fetch(
        `/api/fetch-post-share-count?postId=${postId}`,
      );

      if (!response.ok) {
        throw new Error(`Error fetching post shares: ${response.statusText}`);
      }

      return response.json() as Promise<ShareCountResponse>;
    },
  });
};

export const usePostShareStatus = (postId: string) => {
  const session = useSession();

  return useQuery({
    queryKey: ["postShareStatus", postId, session?.data?.user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/check-share-status?postId=${postId}`);
      if (!response.ok) {
        throw new Error(
          `Error fetching post share status: ${response.statusText}`,
        );
      }

      return response.json() as Promise<ShareStatusResponse>;
    },

    enabled: Boolean(session?.data?.user),
  });
};

export const useCommentShares = (commentId: string) => {};

export const useCommentShareStatus = (commentId: string) => {};
