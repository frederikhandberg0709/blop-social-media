"use client";

import { useSearchParams } from "next/navigation";
import Post from "@/components/post/PostTemplate";
import { useEffect, useState } from "react";

interface PostProps {
  id: string;
  profilePicture: string | null;
  profileName: string | null;
  username: string;
  timestamp: string;
  title: (string | React.ReactElement | React.ReactElement[])[];
  textContent: string;
  likesCount: number;
}

const PostDetailClient: React.FC<{ post: PostProps }> = ({ post }) => {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  const [showSuccessMessage, setShowSuccessMessage] = useState(
    success === "true"
  );

  useEffect(() => {
    if (success === "true") {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <>
      {showSuccessMessage && (
        <div className="fixed top-[90px] left-1/2 -translate-x-1/2 text-[17px] font-semibold bg-gradient-to-b from-blue-500 to-blue-800 rounded-full px-[20px] py-[10px]">
          Your new post has been successfully published!
        </div>
      )}
      <div className="flex justify-center mt-[90px] mb-[100px]">
        <div className="flex flex-col gap-[30px] w-[800px]">
          <Post
            profilePicture={post.profilePicture}
            profileName={post.profileName}
            username={post.username}
            timestamp={post.timestamp}
            title={post.title}
            textContent={post.textContent}
            likesCount={post.likesCount}
          />
          {/* Comments */}
        </div>
      </div>
    </>
  );
};

export default PostDetailClient;
