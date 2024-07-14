"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PrimaryButton from "@/components/buttons/PrimaryButton";
// import { useTheme } from "@/context/ThemeContext";
import PostHistory from "@/components/PostHistory";
import useUserColor from "@/hooks/useUserColor";
import PostTemplate from "@/components/post/PostTemplate";
import DangerButton from "@/components/buttons/DangerButton";

// interface EditPostProps {
//   postId: string;
// }

const EditPost: React.FC = () => {
  const { id } = useParams();
  const postId = Array.isArray(id) ? id[0] : id;
  const { data: session } = useSession();
  const router = useRouter();
  const [post, setPost] = useState<{ title: string; content: string } | null>(
    null
  );
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [wordCount, setWordCount] = useState<number>(0);
  const borderColor = useUserColor();
  const [isPostTitleFocused, setIsPostTitleFocused] = useState<boolean>(false);
  const [isPostTitleHovered, setIsPostTitleHovered] = useState<boolean>(false);
  const [isPostContentFocused, setIsPostContentFocused] =
    useState<boolean>(false);
  const [isPostContentHovered, setIsPostContentHovered] =
    useState<boolean>(false);
  const [view, setView] = useState<"preview" | "history">("preview");

  const handlePostTitleFocus = () => setIsPostTitleFocused(true);
  const handlePostTitleBlur = () => setIsPostTitleFocused(false);
  const handlePostTitleMouseOver = () => setIsPostTitleHovered(true);
  const handlePostTitleMouseOut = () => setIsPostTitleHovered(false);

  const handlePostContentFocus = () => setIsPostContentFocused(true);
  const handlePostContentBlur = () => setIsPostContentFocused(false);
  const handlePostContentMouseOver = () => setIsPostContentHovered(true);
  const handlePostContentMouseOut = () => setIsPostContentHovered(false);

  const calculateTitleBorderColor = () => {
    if (isPostTitleFocused || isPostTitleHovered) return borderColor;
    return `${borderColor}33`; // 20% opacity
  };

  const calculateTextBorderColor = () => {
    if (isPostContentFocused || isPostContentHovered) return borderColor;
    return `${borderColor}33`; // 20% opacity
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setContent(newText);
    setCharacterCount(newText.length);
    setWordCount(newText ? newText.trim().split(/\s+/).length : 0);

    const val = event.target?.value;
    setContent(val);
  };

  const parseTextWithMedia = (inputText: string) => {
    const mediaRegex = /(https:\/\/.*?\.(jpg|jpeg|png|gif|mp4|avi|mov))/g;
    let parts = [];
    let lastIndex = 0;

    let match;
    while ((match = mediaRegex.exec(inputText)) !== null) {
      const textBeforeMedia = inputText.slice(lastIndex, match.index);
      parts.push(
        textBeforeMedia.split("\n").map((line, index, array) => (
          <React.Fragment key={`${lastIndex}-${index}`}>
            {line}
            {index < array.length + 1 && <br />}
          </React.Fragment>
        ))
      );

      const mediaLink = match[0];
      const isImage = /\.(jpg|jpeg|png|gif)$/.test(mediaLink);
      if (isImage) {
        parts.push(
          <img
            key={mediaLink}
            src={mediaLink}
            alt="User uploaded content"
            className="rounded-[10px]"
          />
        );
      } else {
        parts.push(
          <video
            key={mediaLink}
            src={mediaLink}
            className="rounded-[10px]"
            width="100%"
            controls
            autoPlay
            muted
          />
        );
      }

      lastIndex = mediaRegex.lastIndex;
    }

    const remainingText = inputText.slice(lastIndex);
    parts.push(
      remainingText.split("\n").map((line, index, array) => (
        <React.Fragment key={`${lastIndex}-${index}`}>
          {line}
          {index < array.length - 1 && <br />}
        </React.Fragment>
      ))
    );

    return parts;
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/fetch-post/${postId}`);
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

    if (!session) {
      alert("You must be logged in to edit a post.");
      return;
    }

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
              onChange={handleTextChange}
              // onChange={(e) => setContent(e.target.value)}
              className="my-[30px] p-[15px] min-h-[400px] w-full bg-transparent outline-none border-2 rounded-xl overflow-hidden transition duration-150 ease-in-out border-dynamic"
              style={{
                borderColor: calculateTextBorderColor(),
                borderWidth: "2px",
              }}
              onFocus={handlePostContentFocus}
              onBlur={handlePostContentBlur}
              onMouseOver={handlePostContentMouseOver}
              onMouseOut={handlePostContentMouseOut}
            />

            <div className="flex justify-between items-center gap-[30px]">
              <div className="flex gap-[30px]">
                <p className="text-white/50">
                  Character count: {characterCount}
                </p>
                <p className="text-white/50">Word count: {wordCount}</p>
              </div>
              <div className="flex gap-[30px]">
                <PrimaryButton
                  onClick={handleUpdatePost}
                  disabled={!content.trim()}
                >
                  Update Post
                </PrimaryButton>
                <DangerButton>Cancel</DangerButton>
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-white/5"></div>
          <div className="flex gap-5">
            <PrimaryButton
              onClick={() => setView("preview")}
              className={view === "preview" ? "opacity-100" : "opacity-50"}
            >
              Preview Post
            </PrimaryButton>
            <PrimaryButton
              onClick={() => setView("history")}
              className={view === "history" ? "opacity-100" : "opacity-50"}
            >
              Post History
            </PrimaryButton>
          </div>
          {view === "preview" ? (
            <div>
              <h1 className="font-bold mb-[20px] text-white/50">
                Preview Post
              </h1>
              <PostTemplate
                id={session?.user.id || ""}
                profilePicture={session?.user.profilePicture || ""}
                profileName={
                  session?.user.profileName || session?.user.username || ""
                }
                username={session?.user.username || ""}
                timestamp={""}
                title={parseTextWithMedia(title)}
                textContent={content}
                initialLikesCount={0}
                userLiked={false}
              />
            </div>
          ) : (
            <PostHistory postId={postId} />
          )}
        </div>
      </div>
    </>
  );
};

export default EditPost;
