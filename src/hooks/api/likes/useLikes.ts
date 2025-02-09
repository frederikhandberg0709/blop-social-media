import { LikeParams, LikesData } from "@/types/api/likes";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { likeKeys } from "./keys";

export function useLikeCount({ type, id }: LikeParams) {
  const session = useSession();
  const userId = session?.data?.user?.id;

  return useQuery<LikesData>({
    queryKey: likeKeys.single({ type, id }),

    queryFn: async () => {
      const url = new URL(`/api/${type}s/${id}/likes`, window.location.origin);

      if (userId) {
        url.searchParams.append("userId", userId);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Error fetching likes: ${response.statusText}`);
      }

      return response.json();
    },

    enabled: Boolean(id),
    staleTime: 3000,
    refetchOnWindowFocus: false,
    placeholderData: {
      likesCount: 0,
      userLiked: false,
    },
  });
}
