"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/buttons/PrimaryButton";
// import { useTheme } from "@/context/ThemeContext";
import PostHistory from "@/components/PostHistory";
import useUserColor from "@/hooks/useUserColor";

interface EditPostProps {
  postId: string;
}

const EditPost: React.FC<EditPostProps> = ({ postId }) => {
  const { data: session } = useSession();
  const router = useRouter();
  //   const { borderColor } = useTheme();
  const [post, setPost] = useState<{ title: string; content: string } | null>(
    null
  );
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const borderColor = useUserColor();
  const [isPostTitleFocused, setIsPostTitleFocused] = useState<boolean>(false);
  const [isPostTitleHovered, setIsPostTitleHovered] = useState<boolean>(false);
  const [isPostTextFocused, setIsPostTextFocused] = useState<boolean>(false);
  const [isPostTextHovered, setIsPostTextHovered] = useState<boolean>(false);

  const handlePostTitleFocus = () => setIsPostTitleFocused(true);
  const handlePostTitleBlur = () => setIsPostTitleFocused(false);
  const handlePostTitleMouseOver = () => setIsPostTitleHovered(true);
  const handlePostTitleMouseOut = () => setIsPostTitleHovered(false);

  const handlePostTextFocus = () => setIsPostTextFocused(true);
  const handlePostTextBlur = () => setIsPostTextFocused(false);
  const handlePostTextMouseOver = () => setIsPostTextHovered(true);
  const handlePostTextMouseOut = () => setIsPostTextHovered(false);

  const calculateTitleBorderColor = () => {
    if (isPostTitleFocused || isPostTitleHovered) return borderColor;
    return `${borderColor}33`; // 20% opacity
  };

  const calculateTextBorderColor = () => {
    if (isPostTextFocused || isPostTextHovered) return borderColor;
    return `${borderColor}33`; // 20% opacity
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/post?postId=${postId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const data = await response.json();
        setPost(data);
        setTitle(data.title || "");
        setContent(data.content);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleUpdatePost = async () => {
    if (!content.trim()) return;

    try {
      const response = await fetch("/api/update-post", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          title,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Error updating post");
      }

      const updatedPost = await response.json();
      console.log("Post updated:", updatedPost);

      router.push(`/post/${updatedPost.id}`);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <>
      <div className="flex justify-center mt-[90px] mb-[100px]">
        <div className="flex flex-col gap-[30px] w-[800px]">
          <div>
            <h1 className="text-[25px] font-semibold">Edit Post</h1>
            <input
              type="text"
              placeholder="Title of post (optional)..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-[30px] p-[15px] w-full bg-transparent outline-none border-2 rounded-xl transition duration-300 ease-in-out border-dynamic"
              style={{
                borderColor: calculateTitleBorderColor(),
                borderWidth: "2px",
              }}
              onFocus={handlePostTitleFocus}
              onBlur={handlePostTitleBlur}
              onMouseOver={handlePostTitleMouseOver}
              onMouseOut={handlePostTitleMouseOut}
            />
            <textarea
              placeholder="Write your post here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="my-[30px] p-[15px] min-h-[400px] w-full bg-transparent outline-none border-2 rounded-xl overflow-hidden transition duration-150 ease-in-out border-dynamic"
              style={{
                borderColor: calculateTextBorderColor(),
                borderWidth: "2px",
              }}
              onFocus={handlePostTextFocus}
              onBlur={handlePostTextBlur}
              onMouseOver={handlePostTextMouseOver}
              onMouseOut={handlePostTextMouseOut}
            />
            <PrimaryButton onClick={handleUpdatePost}>
              Update Post
            </PrimaryButton>
          </div>
          <PostHistory postId={postId} />
        </div>
      </div>
    </>
  );
};

export default EditPost;
