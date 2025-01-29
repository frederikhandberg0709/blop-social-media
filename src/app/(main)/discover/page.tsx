"use client";

import { useState, useEffect, useCallback } from "react";
import PostTemplate from "@/components/post/PostTemplate";
import { useSession } from "next-auth/react";
import { useDiscoverTimeline } from "@/hooks/api/queries/useTimelineQueries";

const Discover: React.FC = () => {
  // const { data: session } = useSession();
  const { data, error, isLoading } = useDiscoverTimeline();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="mt-[70px] flex min-h-screen flex-col items-center justify-start py-6 sm:py-12">
        <div className="flex w-[800px] flex-col gap-[15px]">
          <div className="flex items-center justify-between">
            {/* Page title */}
            <h1 className="text-3xl font-semibold">DISCOVER</h1>
            {/* Filters */}
            <button className="rounded-md border border-transparent px-[15px] py-[5px] font-medium text-primaryGray transition duration-150 ease-in-out hover:bg-primaryBlue hover:text-black dark:hover:text-white">
              Filters
            </button>
          </div>

          {/* {!session ?? (
            <p className="text-sm text-primaryGray">
              <span className="font-semibold">Discover New Poeple</span>:
              Explore posts from people you don&apos;t follow.
            </p>
          )} */}

          {isLoading && <p>Loading posts...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* {isLoading ? (
            <p className="mt-4 text-center">Loading...</p>
          ) : ( */}
          {/* <div className="space-y-4"> */}
          {data?.posts.map((post) => (
            <PostTemplate key={`${post.id}-${post.createdAt}`} {...post} />
          ))}
          {/* </div> */}
          {/* )} */}
        </div>
      </div>
    </>
  );
};

export default Discover;
