import { BookmarkParams, BookmarkType } from "@/types/api/bookmarks";
import { useQuery } from "@tanstack/react-query";
import { bookmarkKeys } from "./bookmarkKeys";

export function useBookmarks({ type }: { type: BookmarkType }) {
  return useQuery({
    queryKey: bookmarkKeys.list(type),

    queryFn: async () => {
      const url = new URL("/api/bookmarks", window.location.origin);
      if (type !== "all") {
        url.searchParams.set("type", type);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error("Failed to fetch bookmarks");
      }

      return response.json();
    },
  });
}
