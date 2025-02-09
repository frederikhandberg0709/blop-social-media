export interface BookmarkParams {
  type: "post" | "comment";
  id: string;
}

export interface BookmarkStatus {
  isBookmarked: boolean;
  bookmarkId: string | null;
}
