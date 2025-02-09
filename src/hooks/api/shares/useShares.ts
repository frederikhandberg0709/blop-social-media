import { ShareParams, ShareCount } from "@/types/api/shares";
import { useQuery } from "@tanstack/react-query";
import { shareKeys } from "./keys";

export function useShareCount({ type, id }: ShareParams) {
  return useQuery<ShareCount>({
    queryKey: shareKeys.count({ type, id }),
    queryFn: async () => {
      const url = new URL(
        `/api/${type}s/${id}/shares/count`,
        window.location.origin,
      );
      url.searchParams.append(`${type}Id`, id);

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Error fetching share count: ${response.statusText}`);
      }

      return response.json();
    },
  });
}
