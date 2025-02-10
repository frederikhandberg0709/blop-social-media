import { BookmarkParams } from "@/types/api/bookmarks";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface BookmarkStatus {
  isBookmarked: boolean;
  bookmarkId: string | null;
}

export function useBookmarkStatus({ type, id }: BookmarkParams) {
  const session = useSession();

  return useQuery<BookmarkStatus, Error>({
    queryKey: ["bookmark", type, id],

    queryFn: async () => {
      const reponse = await fetch(`/api/${type}s/${id}/bookmarks`);

      if (!reponse.ok) {
        throw new Error(`Error fetching bookmarks: ${reponse.statusText}`);
      }

      return reponse.json();
    },

    enabled: Boolean(id) && Boolean(session.data),
    staleTime: 10000,
    placeholderData: { isBookmarked: false, bookmarkId: null },
  });
}
