export type BookmarkType = "all" | "post" | "comment";
export type BookmarkItemType = Exclude<BookmarkType, "all">;

export interface BookmarkParams {
  type: BookmarkType;
  id?: string;
}

export interface BookmarkStatusParams {
  type: BookmarkItemType;
  id: string;
}

export interface BookmarkStatus {
  isBookmarked: boolean;
  bookmarkId: string | null;
}
