"use client";

import Link from "next/link";
import React, { useRef, useState } from "react";
import useAutosizeTextArea from "@/hooks/useAutosizeTextArea";
import PostReactionButtons from "@/components/buttons/PostActionButtons";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PostTemplate from "@/components/post/PostTemplate";
import DangerButton from "@/components/buttons/DangerButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import useUserColor from "@/hooks/useUserColor";
import { formatDate } from "@/utils/formattedDate";

const CreatePost: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [wordCount, setWordCount] = useState<number>(0);
  const [isPostTitleFocused, setIsPostTitleFocused] = useState<boolean>(false);
  const [isPostTitleHovered, setIsPostTitleHovered] = useState<boolean>(false);
  const [isPostContentFocused, setIsPostContentFocused] =
    useState<boolean>(false);
  const [isPostContentHovered, setIsPostContentHovered] =
    useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const borderColor = useUserColor();

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  useAutosizeTextArea(textareaRef.current, content);

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
        )),
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
          />,
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
          />,
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
      )),
    );

    return parts;
  };

  const createPost = async () => {
    if (!content.trim()) return;

    try {
      const response = await fetch("/api/create-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user.id,
          title,
          content,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Error creating post");
      }

      const post = await response.json();
      console.log("Post created:", post);

      setTitle("");
      setContent("");
      setCharacterCount(0);
      setWordCount(0);

      router.push(`/post/${post.id}?success=true`);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <>
      <div className="mb-[100px] mt-[90px] flex justify-center">
        <div className="flex w-[800px] flex-col gap-[30px]">
          <div>
            <h1 className="text-[25px] font-semibold">Create Post</h1>
            <input
              type="text"
              placeholder="Title of post (optional)..."
              value={title}
              onChange={handleTitleChange}
              className="mt-[30px] w-full rounded-xl bg-transparent p-[15px] outline-none transition duration-300 ease-in-out"
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
              ref={textareaRef}
              className="my-[30px] min-h-[400px] w-full overflow-hidden rounded-xl bg-transparent p-[15px] outline-none transition duration-150 ease-in-out"
              style={{
                borderColor: calculateTextBorderColor(),
                borderWidth: "2px",
              }}
              onFocus={handlePostContentFocus}
              onBlur={handlePostContentBlur}
              onMouseOver={handlePostContentMouseOver}
              onMouseOut={handlePostContentMouseOut}
            />

            <div className="flex items-center justify-between gap-[30px]">
              <div className="flex gap-[30px]">
                <p className="text-white/50">
                  Character count: {characterCount}
                </p>
                <p className="text-white/50">Word count: {wordCount}</p>
              </div>
              <div className="flex gap-[30px]">
                <Link
                  href={""}
                  className="w-[100px] rounded-xl py-[12px] text-center font-semibold text-green-500 transition duration-150 ease-in-out hover:bg-green-700 hover:text-white"
                >
                  Save Draft
                </Link>
                <PrimaryButton onClick={createPost} disabled={!content.trim()}>
                  Publish
                </PrimaryButton>
                <DangerButton>Cancel</DangerButton>
              </div>
            </div>
          </div>
          <div className="h-[1px] w-full bg-white/5"></div>
          <div>
            <h1 className="mb-[20px] font-bold text-white/50">Preview Post</h1>
            <PostTemplate
              id={session?.user.id || ""}
              profilePicture={null}
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
        </div>
      </div>
    </>
  );
};

export default CreatePost;
