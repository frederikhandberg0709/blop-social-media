"use client";

import CommentTemplate from "@/components/CommentTemplate";
import PostTemplate from "@/components/post/PostTemplate";
import { CommentProps } from "@/types/CommentProps";
import { PostProps } from "@/types/PostProps";
import { useEffect, useState } from "react";

interface BookmarkedItem {
  type: "post" | "comment";
  data: PostProps | CommentProps;
  bookmarkedAt: string;
}

export default function MyBookmarks() {
  const [bookmarkedItems, setBookmarkedItems] = useState<BookmarkedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    switch (item.type) {
      case "post":
        return (
          <PostTemplate
            key={`post-${item.data.id}`}
            {...(item.data as PostProps)}
          />
        );
      case "comment":
        return (
          <CommentTemplate
            key={`comment-${item.data.id}`}
            {...(item.data as CommentProps)}
          />
        );
      default:
        console.warn(`Unknown item type: ${item.type}`);
        return null;
    }
  };

  return (
    <div className="mt-[70px] flex min-h-screen flex-col items-center justify-start py-6 sm:py-12">
      <div className="flex w-[800px] flex-col gap-[15px]">
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-semibold">MY BOOKMARKS</h2>
          <span className="text-xl font-bold text-primaryGray">·</span>
          <p className="text-xl text-primaryGray">{bookmarkedItems.length}</p>
          <div className="rounded-lg bg-white/10 p-0.5">
            <button className="rounded-md px-2.5 py-1.5 transition duration-150 ease-in-out hover:bg-white/10 active:bg-white/15">
              Posts
            </button>
            <button className="rounded-md px-2.5 py-1.5 transition duration-150 ease-in-out hover:bg-white/10 active:bg-white/15">
              Comments
            </button>
          </div>
        </div>

        {isLoading ? (
          <p>Loading bookmarked items...</p>
        ) : bookmarkedItems.length === 0 ? (
          <p>You haven{"'"}t bookmarked any posts or comments yet.</p>
        ) : (
          bookmarkedItems.map(renderBookmarkedItem)
        )}
      </div>
    </div>
  );
}
