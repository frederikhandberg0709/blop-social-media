import { BookmarkStatusParams, BookmarkType } from "@/types/api/bookmarks";

export const bookmarkKeys = {
  // For listing all bookmarks
  all: () => ["bookmarks"] as const,
  // For filtered list of bookmarks
  list: (type: BookmarkType) => ["bookmarks", type] as const,
  // For single bookmark status
  status: ({ type, id }: BookmarkStatusParams) =>
    ["bookmark", type, id] as const,
} as const;
