"use client";

import DangerButton from "@/components/buttons/DangerButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import PostTemplate from "@/components/post/PostTemplate";
import useAutosizeTextArea from "@/hooks/useAutosizeTextArea";
import useUserColor from "@/hooks/useUserColor";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { UserProps } from "@/types/UserProps";
import { parseTextWithMedia } from "@/utils/parseTextWithMedia";
import { createPost, quotePost } from "@/utils/api-calls/create-post";

export default function QuotePost() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  useEffect(() => {
    if (postId) {
      const postUrl = `${window.location.origin}/post/${postId}`;
      setContent(`\n\n${postUrl}`);
    }
  }, [postId]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      alert("You must be logged in to create a post");
      return;
    }

    setIsLoading(true);
    try {
      if (postId && typeof postId === "string") {
        // This is a quote post
        await quotePost({
          userId: session.user.id,
          title,
          content,
          quotedPostId: postId,
        });
      } else {
        // This is a regular post
        await createPost({
          userId: session.user.id,
          title,
          content,
        });
      }
      router.push("/"); // Redirect to home page after successful post
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "An error occurred while creating the post",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const user: UserProps = {
    id: session?.user.id || "",
    username: session?.user.username || "",
    profileName: session?.user.profileName || "",
    profilePicture: session?.user.image || "",
    profileBanner: "",
    bio: "",
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
  };

  return (
    <>
      <div className="mb-[100px] mt-[90px] flex justify-center">
        <div className="flex w-[800px] flex-col gap-[30px]">
          <div>
            <h1 className="text-[25px] font-semibold">Quote Post</h1>
            <input
              type="text"
              placeholder="Title of post (optional)..."
              value={title}
              onChange={handleTitleChange}
              onFocus={handlePostTitleFocus}
              onBlur={handlePostTitleBlur}
              onMouseOver={handlePostTitleMouseOver}
              onMouseOut={handlePostTitleMouseOut}
              className="mt-[30px] w-full rounded-xl bg-transparent p-[15px] outline-none transition duration-200 ease-in-out"
              style={{
                borderColor: calculateTitleBorderColor(),
                borderWidth: "2px",
              }}
            />
            <textarea
              placeholder="Write your quote here..."
              value={content}
              onChange={handleTextChange}
              ref={textareaRef}
              onFocus={handlePostContentFocus}
              onBlur={handlePostContentBlur}
              onMouseOver={handlePostContentMouseOver}
              onMouseOut={handlePostContentMouseOut}
              className="my-[30px] min-h-[400px] w-full overflow-hidden rounded-xl bg-transparent p-[15px] outline-none transition duration-200 ease-in-out"
              style={{
                borderColor: calculateTextBorderColor(),
                borderWidth: "2px",
              }}
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
                <PrimaryButton
                  onClick={createPost}
                  disabled={!content.trim() && isLoading}
                >
                  {isLoading ? "Publishing..." : "Publish"}
                </PrimaryButton>
                {/* Show warning modal before cancelling */}
                <DangerButton onClick={() => router.push("/home")}>
                  Cancel
                </DangerButton>
              </div>
            </div>
          </div>
          <div className="h-[1px] w-full bg-white/5"></div>
          <div>
            <h1 className="mb-[20px] font-bold text-white/50">
              Preview Quote Post
            </h1>
            <PostTemplate
              id={session?.user.id || ""}
              user={user}
              createdAt={new Date().toISOString()}
              updatedAt={new Date().toISOString()}
              timestamp={new Date().toISOString()}
              title={title}
              content={parseTextWithMedia(content, () => {})}
              initialLikesCount={0}
              userLiked={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}
