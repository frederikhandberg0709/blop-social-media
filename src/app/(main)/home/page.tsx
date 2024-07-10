"use client";

import PostTemplate from "@/components/post/PostTemplate";
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
      <div className="mt-[70px] min-h-screen py-6 flex flex-col justify-start items-center sm:py-12">
        <div className="flex flex-col gap-[15px] w-[800px]">
          <div className="flex justify-between items-center">
            {/* Page title */}
            <h1 className="text-[30px] font-semibold">HOME</h1>
            {/* Filters */}
            <button className="font-medium text-white/50 hover:text-white px-[15px] py-[5px] rounded-md hover:bg-white/10 border border-transparent hover:border-blue-500/50 transition duration-150 ease-in-out">
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
              timestamp={new Date(post.createdAt).toLocaleString()}
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
