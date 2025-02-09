import { ShareParams, ShareStatus } from "@/types/api/shares";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { shareKeys } from "./keys";

export function useShareStatus({ type, id }: ShareParams) {
  const session = useSession();
  const userId = session.data?.user?.id;

  return useQuery<ShareStatus>({
    queryKey: shareKeys.status({ type, id }, userId ?? ""),
    queryFn: async () => {
      const url = new URL(`/api/${type}s/${id}/shares`, window.location.origin);
      url.searchParams.append(type === "post" ? "postId" : "commentId", id);

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Error fetching share status: ${response.statusText}`);
      }

      return response.json();
    },
    enabled: Boolean(userId),
  });
}
