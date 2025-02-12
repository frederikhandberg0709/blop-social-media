"use client";

import PostTemplate from "@/components/post/PostTemplate";
import { CommentProps } from "@/types/components/comment";
import { PostProps } from "@/types/components/post";
import { useState } from "react";
import CommentWithContext from "./CommentWithContext";
import { useBookmarks } from "@/hooks/api/bookmarks/useBookmarks";
import { BookmarkType } from "@/types/api/bookmarks";

const BOOKMARK_TYPES: BookmarkType[] = ["all", "post", "comment"];

interface BookmarkedItem {
  type: BookmarkType;
  data:
    | PostProps
    | (CommentProps & {
        post: { id: string; user: { username: string; profileName?: string } };
      });
  bookmarkedAt: string;
}

type BookmarkRendererProps = {
  bookmark: BookmarkedItem;
};

export default function MyBookmarks() {
  const [filter, setFilter] = useState<BookmarkType>("all");
  const { data: bookmarks, isPending: isPendingBookmarks } = useBookmarks({
    type: filter,
  });

  return (
    <div className="mt-[70px] flex min-h-screen flex-col items-center justify-start py-6 sm:py-12">
      <div className="flex w-[800px] flex-col gap-[15px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-semibold">MY BOOKMARKS</h2>
            <span className="text-xl font-bold text-primaryGray">·</span>
            <p className="text-xl text-primaryGray">{bookmarks?.length}</p>
          </div>
          <div className="rounded-lg bg-black/5 p-1 dark:bg-white/5">
            {BOOKMARK_TYPES.map((type) => (
              <button
                key={type}
                className={`${
                  type !== "all" ? "mx-1" : ""
                } rounded-md px-2.5 py-1.5 transition duration-150 ease-in-out hover:bg-black/10 hover:text-black active:bg-black/20 dark:hover:bg-white/10 dark:hover:text-white dark:active:bg-white/20 ${
                  filter === type
                    ? "bg-black/15 text-black dark:bg-white/15 dark:text-white"
                    : "text-black/75 dark:text-white/75"
                }`}
                onClick={() => setFilter(type as BookmarkType)}
              >
                {type === "all"
                  ? "All"
                  : `${type.charAt(0).toUpperCase() + type.slice(1)}s`}
              </button>
            ))}
          </div>
        </div>

        {isPendingBookmarks ? (
          <p>Loading bookmarked items...</p>
        ) : bookmarks.length === 0 ? (
          <p>
            You haven&apos;t bookmarked any{" "}
            {filter === "all" ? "posts or comments" : filter} yet.
          </p>
        ) : (
          bookmarks?.map((bookmark: BookmarkedItem) => (
            <BookmarkRenderer
              key={`${bookmark.type}-${bookmark.data.id}`}
              bookmark={bookmark}
            />
          ))
        )}
      </div>
    </div>
  );
}

const BookmarkRenderer = ({ bookmark }: BookmarkRendererProps) => {
  switch (bookmark.type) {
    case "post":
      return (
        <PostTemplate
          key={`post-${bookmark.data.id}`}
          {...(bookmark.data as PostProps)}
        />
      );

    case "comment":
      const commentData = bookmark.data as CommentProps;
      return (
        <CommentWithContext
          key={`comment-${commentData.id}`}
          {...(bookmark.data as CommentProps & {
            post: {
              id: string;
              user: { username: string; profileName?: string };
            };
          })}
        />
      );

    default:
      console.warn(`Unknown bookmark type: ${bookmark.type}`);
      return null;
  }
};
