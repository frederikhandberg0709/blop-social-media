"use client";

import { useParams, useSearchParams } from "next/navigation";
import Post from "@/components/post/PostTemplate";
import { useEffect, useState } from "react";
import { Post as PostProps } from "@/types/components/post";
import { usePost } from "@/hooks/api/posts/usePost";
import { AnimatePresence, motion } from "framer-motion";

const PostDetail: React.FC<{ post: PostProps }> = () => {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const params = useParams();

  const { data: postData, isPending: isPostPending } = usePost({
    postId: params.id as string,
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(
    success === "true",
  );

  useEffect(() => {
    if (success === "true") {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <>
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-x-0 top-[90px] mx-auto max-w-fit select-none rounded-full bg-gradient-to-b from-blue-500 to-blue-800 px-[20px] py-[10px] text-[17px] font-semibold`}
          >
            Your new post has been successfully published!
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-[70px] flex min-h-screen flex-col items-center justify-start py-6 sm:py-12">
        <div className="flex w-[800px] flex-col gap-[30px]">
          <h1 className="text-3xl font-semibold">POST</h1>

          {isPostPending && <p>Loading post...</p>}

          <Post
            key={postData?.id}
            id={postData?.id}
            user={postData?.user}
            createdAt={postData?.createdAt}
            updatedAt={postData?.updatedAt}
            timestamp={postData?.updatedAt || postData?.createdAt}
            title={postData?.title}
            content={postData?.content}
            initialLikesCount={postData?.initialLikesCount}
            userLiked={postData?.userLiked}
          />
        </div>
      </div>
    </>
  );
};

export default PostDetail;
