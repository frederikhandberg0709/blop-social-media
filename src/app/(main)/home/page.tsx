"use client";

import PostTemplate from "@/components/post/PostTemplate";
import { PostProps } from "@/types/PostProps";
import { UserProps } from "@/types/UserProps";
import { useEffect, useState } from "react";

const Home: React.FC = () => {
  const [timeline, setTimeline] = useState<PostProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/home-timeline");
        if (!response.ok) {
          throw new Error("Failed to fetch home timeline");
        }
        const data = await response.json();
        setTimeline(data.posts);
      } catch (error) {
        console.error("Error fetching home timeline:", error);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeline();
  }, []);

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

          {!isLoading && !error && timeline.length === 0 && (
            <p>No posts to display. Try following some users!</p>
          )}

          {timeline.map((post) => (
            <PostTemplate key={post.id} {...post} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
