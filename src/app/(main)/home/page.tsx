"use client";

import PostTemplate from "@/components/post/PostTemplate";
import { PostProps } from "@/types/PostProps";
import { useEffect, useState } from "react";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/fetch-all-posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data.posts);
      } catch (error) {
        const err = error as Error;
        console.error(err.message);
      }
    };

    fetchPosts();
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
          {/* {Array.isArray(posts) && posts.length > 0 ? ( */}
          {posts?.map((post) => (
            <PostTemplate
              key={post.id}
              id={post.id}
              user={post.user}
              createdAt={post.createdAt}
              updatedAt={post.updatedAt}
              timestamp={post.updatedAt || post.createdAt}
              title={post.title}
              content={post.content}
              initialLikesCount={post.initialLikesCount ?? 0}
              userLiked={post.userLiked}
            />
          ))}
          {/* ) : (
            <p>No posts available.</p>
          )} */}
        </div>
      </div>
    </>
  );
};

export default Home;
