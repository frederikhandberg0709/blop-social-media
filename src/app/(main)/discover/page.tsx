"use client";

import { useState, useEffect, useCallback } from "react";
import { PostProps } from "@/types/PostProps";
import PostTemplate from "@/components/post/PostTemplate";
import { useSession } from "next-auth/react";

const Discover: React.FC = () => {
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchDiscoverPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = new URL("/api/discover-timeline", window.location.origin);
        if (session?.user?.id)
          url.searchParams.append("userId", session.user.id);

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error("Failed to fetch discover posts");
        }

        const data = await response.json();
        setPosts(data.posts);
      } catch (error) {
        console.error("Error loading discover posts:", error);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscoverPosts();
  }, [session]);

  return (
    <>
      <div className="mt-[70px] flex min-h-screen flex-col items-center justify-start py-6 sm:py-12">
        <div className="flex w-[800px] flex-col gap-[15px]">
          <div className="flex items-center justify-between">
            {/* Page title */}
            <h1 className="text-3xl font-semibold">DISCOVER</h1>
            {/* Filters */}
            <button className="rounded-md border border-transparent px-[15px] py-[5px] font-medium text-black/50 transition duration-150 ease-in-out hover:border-blue-500/50 hover:bg-black/10 hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white">
              Filters
            </button>
          </div>

          {!session ?? (
            <p className="text-sm text-primaryGray">
              <span className="font-semibold">Discover New Poeple</span>:
              Explore posts from people you don&apos;t follow.
            </p>
          )}

          {isLoading ? (
            <p className="mt-4 text-center">Loading...</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostTemplate
                  key={`${post.id}-${post.createdAt}`}
                  // post={post}
                  {...post}
                />
              ))}
            </div>
          )}
          {!isLoading && posts.length === 0 && (
            <p className="mt-4 text-center">No posts found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Discover;
