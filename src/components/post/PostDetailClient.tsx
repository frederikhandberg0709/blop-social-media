"use client";

import { useSearchParams } from "next/navigation";
import Post from "@/components/post/PostTemplate";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/formattedDate";
import { PostProps } from "@/types/PostProps";
import { getTimestamp } from "@/utils/getTimestamp";

const PostDetailClient: React.FC<{ post: PostProps }> = ({ post }) => {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  const [showSuccessMessage, setShowSuccessMessage] = useState(
    success === "true",
  );

  useEffect(() => {
    if (success === "true") {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success]);

  const timestamp = getTimestamp(post.createdAt, post.updatedAt);

  return (
    <>
      {showSuccessMessage && (
        <div className="fixed left-1/2 top-[90px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-500 to-blue-800 px-[20px] py-[10px] text-[17px] font-semibold">
          Your new post has been successfully published!
        </div>
      )}
      <div className="mb-[100px] mt-[90px] flex justify-center">
        <div className="flex w-[800px] flex-col gap-[30px]">
          <Post
            key={post.id}
            id={post.id}
            user={post.user}
            createdAt={"0"}
            updatedAt={"0"}
            // timestamp={formatDate(post.updatedAt || post.createdAt)}
            timestamp={new Date().toISOString()}
            title={post.title}
            content={post.content}
            initialLikesCount={post.initialLikesCount}
            userLiked={post.userLiked}
          />
          {/* Comments */}
        </div>
      </div>
    </>
  );
};

export default PostDetailClient;
