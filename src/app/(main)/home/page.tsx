"use client";

import PostTemplate from "@/components/post/PostTemplate";
import { useHomeTimeline } from "@/hooks/api/queries/useTimelineQueries";
import { UserProps } from "@/types/user";
import { useEffect, useState } from "react";

const Home: React.FC = () => {
  const { data, error, isLoading } = useHomeTimeline();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="mt-[70px] flex min-h-screen flex-col items-center justify-start py-6 sm:py-12">
        <div className="flex w-[800px] flex-col gap-[15px]">
          <div className="flex items-center justify-between">
            {/* Page title */}
            <h1 className="text-3xl font-semibold">HOME</h1>
            {/* Filters */}
            <button className="rounded-md px-[15px] py-[5px] font-medium text-primaryGray transition duration-150 ease-in-out hover:bg-primaryBlue hover:text-black dark:hover:text-white">
              Filters
            </button>
          </div>
          {isLoading && <p>Loading posts...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* {!isLoading && !error && data?.timeline.length === 0 && (
            <p>No posts to display. Try following some users!</p>
          )} */}

          {data?.posts.map((post) => <PostTemplate key={post.id} {...post} />)}
        </div>
      </div>
    </>
  );
};

export default Home;
