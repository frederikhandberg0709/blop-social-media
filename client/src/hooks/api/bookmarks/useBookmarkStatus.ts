import { BookmarkStatusParams } from "@/types/api/bookmarks";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { bookmarkKeys } from "./bookmarkKeys";

interface BookmarkStatus {
  isBookmarked: boolean;
  bookmarkId: string | null;
}

export function useBookmarkStatus({ type, id }: BookmarkStatusParams) {
  const session = useSession();

  return useQuery<BookmarkStatus, Error>({
    queryKey: bookmarkKeys.status({ type, id }),

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
