"use client";

import CommentTemplate from "@/components/CommentTemplate";
import PostTemplate from "@/components/post/PostTemplate";
import { CommentProps } from "@/types/CommentProps";
import { PostProps } from "@/types/PostProps";
import Link from "next/link";
import { useEffect, useState } from "react";
import CommentWithContext from "./CommentWithContext";

type PostAuthor = string | { username: string; profileName?: string };

interface BookmarkedItem {
  type: "post" | "comment";
  data:
    | PostProps
    | (CommentProps & {
        post: { id: string; user: { username: string; profileName?: string } };
      });
  bookmarkedAt: string;
}

export default function MyBookmarks() {
  const [bookmarkedItems, setBookmarkedItems] = useState<BookmarkedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "post" | "comment">("all");

  useEffect(() => {
    fetchBookmarkedItems();
  }, []);

  const fetchBookmarkedItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/bookmarks");
      if (response.ok) {
        const data = await response.json();
        // Sort the items by bookmarkedAt date, newest first
        console.log("Fetched bookmarked items:", data);
        const sortedItems = data.sort(
          (a: BookmarkedItem, b: BookmarkedItem) =>
            new Date(b.bookmarkedAt).getTime() -
            new Date(a.bookmarkedAt).getTime(),
        );
        setBookmarkedItems(sortedItems);
      } else {
        console.error("Failed to fetch bookmarked items");
      }
    } catch (error) {
      console.error("Error fetching bookmarked items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBookmarkedItem = (item: BookmarkedItem) => {
    console.log("Rendering item:", JSON.stringify(item, null, 2));
    switch (item.type) {
      case "post":
        return (
          <PostTemplate
            key={`post-${item.data.id}`}
            {...(item.data as PostProps)}
          />
        );
      case "comment":
        const commentData = item.data as CommentProps;

        return (
          <CommentWithContext
            key={`comment-${commentData.id}`}
            {...(item.data as CommentProps & {
              post: {
                id: string;
                user: { username: string; profileName?: string };
              };
            })}
          />
        );
      default:
        console.warn(`Unknown item type: ${item.type}`);
        return null;
    }
  };

  const filteredItems = bookmarkedItems.filter((item) =>
    filter === "all" ? true : item.type === filter,
  );

  return (
    <div className="mt-[70px] flex min-h-screen flex-col items-center justify-start py-6 sm:py-12">
      <div className="flex w-[800px] flex-col gap-[15px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-semibold">MY BOOKMARKS</h2>
            <span className="text-xl font-bold text-primaryGray">·</span>
            <p className="text-xl text-primaryGray">{filteredItems.length}</p>
          </div>
          <div className="rounded-lg bg-black/5 p-1 dark:bg-white/5">
            <button
              className={`rounded-md px-2.5 py-1.5 transition duration-150 ease-in-out hover:bg-black/10 hover:text-black active:bg-black/20 dark:hover:bg-white/10 dark:hover:text-white dark:active:bg-white/20 ${filter === "all" ? "bg-black/15 text-black dark:bg-white/15 dark:text-white" : "text-black/75 dark:text-white/75"}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`mx-1 rounded-md px-2.5 py-1.5 transition duration-150 ease-in-out hover:bg-black/10 hover:text-black active:bg-black/20 dark:hover:bg-white/10 dark:hover:text-white dark:active:bg-white/20 ${filter === "post" ? "bg-black/15 text-black dark:bg-white/15 dark:text-white" : "text-black/75 dark:text-white/75"}`}
              onClick={() => setFilter("post")}
            >
              Posts
            </button>
            <button
              className={`rounded-md px-2.5 py-1.5 transition duration-150 ease-in-out hover:bg-black/10 hover:text-black active:bg-black/20 dark:hover:bg-white/10 dark:hover:text-white dark:active:bg-white/20 ${filter === "comment" ? "bg-black/15 text-black dark:bg-white/15 dark:text-white" : "text-black/75 dark:text-white/75"}`}
              onClick={() => setFilter("comment")}
            >
              Comments
            </button>
          </div>
        </div>

        {isLoading ? (
          <p>Loading bookmarked items...</p>
        ) : filteredItems.length === 0 ? (
          <p>
            You haven&apos;t bookmarked any{" "}
            {filter === "all" ? "posts or comments" : filter} yet.
          </p>
        ) : (
          filteredItems.map(renderBookmarkedItem)
        )}
      </div>
    </div>
  );
}
