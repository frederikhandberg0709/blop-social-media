"use client";

import PostTemplate from "@/components/post/PostTemplate";
import { formatDate } from "@/utils/formattedDate";
import { useEffect, useState } from "react";

interface PostData {
  id: string;
  title: (string | React.ReactElement | React.ReactElement[])[];
  content: string;
  createdAt: string;
  likesCount: number;
  userLiked: boolean;
  user: {
    displayName: string;
    username: string;
    profilePicture: string;
  };
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/fetch-all-posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        const err = error as Error;
        console.error(err.message);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      {/* <MainNavBar /> */}
      <div className="mt-[70px] flex min-h-screen flex-col items-center justify-start py-6 sm:py-12">
        <div className="flex w-[800px] flex-col gap-[15px]">
          <div className="flex items-center justify-between">
            {/* Page title */}
            <h1 className="text-[30px] font-semibold">HOME</h1>
            {/* Filters */}
            <button className="rounded-md border border-transparent px-[15px] py-[5px] font-medium text-black/50 transition duration-150 ease-in-out hover:border-blue-500/50 hover:bg-black/10 hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white">
              Filters
            </button>
          </div>
          {posts.map((post) => (
            <PostTemplate
              key={post.id}
              id={post.id}
              profilePicture={post.user.profilePicture}
              profileName={post.user.displayName}
              username={post.user.username}
              // timestamp={new Date(post.createdAt).toLocaleString()}
              // timestamp={post.createdAt}
              timestamp={formatDate(post.createdAt)}
              title={post.title}
              textContent={post.content}
              initialLikesCount={post.likesCount ?? 0}
              userLiked={post.userLiked}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
