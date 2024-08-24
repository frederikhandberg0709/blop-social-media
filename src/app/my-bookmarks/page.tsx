"use client";

import CommentTemplate from "@/components/CommentTemplate";
import PostTemplate from "@/components/post/PostTemplate";
import { CommentProps } from "@/types/CommentProps";
import { PostProps } from "@/types/PostProps";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BookmarkedItem {
  type: "post" | "comment";
  data: PostProps | CommentProps;
  bookmarkedAt: string;
  postId?: string;
  postAuthor?: string;
}

// WIP
const CommentWithContext: React.FC<{
  comment: CommentProps;
  postId?: string;
  postAuthor?: string;
}> = ({ comment, postId, postAuthor }) => {
  return (
    <div className="rounded-lg border p-4 transition duration-200 dark:border-darkBorder dark:hover:border-darkBorderHover sm:rounded-2xl">
      {postAuthor && (
        <p className="mb-2 text-sm text-gray-500">
          Commented on @{postAuthor}&apos;s post
        </p>
      )}
      {postId && (
        <Link href={`/post/${postId}`}>
          <button className="mt-2 rounded bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-600">
            Show post
          </button>
        </Link>
      )}
      <CommentTemplate {...comment} />
    </div>
  );
};

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
          <CommentWithContext
            key={`comment-${item.data.id}`}
            comment={item.data as CommentProps}
            postId={item.postId}
            postAuthor={item.postAuthor}
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
          <div className="rounded-lg bg-white/10 p-1">
            <button
              className={`rounded-md px-2.5 py-1.5 transition duration-150 ease-in-out hover:bg-white/10 active:bg-white/25 ${filter === "all" ? "bg-white/20" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`mx-1 rounded-md px-2.5 py-1.5 transition duration-150 ease-in-out hover:bg-white/10 active:bg-white/25 ${filter === "post" ? "bg-white/20" : ""}`}
              onClick={() => setFilter("post")}
            >
              Posts
            </button>
            <button
              className={`rounded-md px-2.5 py-1.5 transition duration-150 ease-in-out hover:bg-white/10 active:bg-white/25 ${filter === "comment" ? "bg-white/20" : ""}`}
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
