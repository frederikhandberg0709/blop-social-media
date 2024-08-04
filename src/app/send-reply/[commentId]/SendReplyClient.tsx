"use client";

import DangerButton from "@/components/buttons/DangerButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import ToggleSwitch from "@/components/buttons/ToggleSwitch";
import CommentTemplate from "@/components/CommentTemplate";
import PostTemplate from "@/components/post/PostTemplate";
import useAutosizeTextArea from "@/hooks/useAutosizeTextArea";
import useUserColor from "@/hooks/useUserColor";
import { CommentProps } from "@/types/CommentProps";
import { PostProps } from "@/types/PostProps";
import { formatDate } from "@/utils/formattedDate";
import { getTimestamp } from "@/utils/getTimestamp";
import { parseTextWithMedia } from "@/utils/parseTextWithMedia";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface SendReplyClientProps {
  comment: CommentProps | null;
}

export default function SendReplyClient({ comment }: SendReplyClientProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [likesCount, setLikesCount] = useState(comment?.initialLikesCount);
  const [liked, setLiked] = useState(comment?.userLiked);
  const [replyTitle, setReplyTitle] = useState<string>("");
  const [replyContent, setReplyContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [wordCount, setWordCount] = useState<number>(0);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [isReplyTitleFocused, setIsReplyTitleFocused] =
    useState<boolean>(false);
  const [isReplyTitleHovered, setIsReplyTitleHovered] =
    useState<boolean>(false);
  const [isReplyContentFocused, setIsReplyContentFocused] =
    useState<boolean>(false);
  const [isReplyContentHovered, setIsReplyContentHovered] =
    useState<boolean>(false);
  const [showParentComment, setShowParentComment] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const borderColor = useUserColor();

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReplyTitle(event.target.value);
  };

  useAutosizeTextArea(textareaRef.current, replyContent);

  const handleReplyTitleFocus = () => setIsReplyTitleFocused(true);
  const handleReplyTitleBlur = () => setIsReplyTitleFocused(false);
  const handleReplyTitleMouseOver = () => setIsReplyTitleHovered(true);
  const handleReplyTitleMouseOut = () => setIsReplyTitleHovered(false);

  const handleReplyContentFocus = () => setIsReplyContentFocused(true);
  const handleReplyContentBlur = () => setIsReplyContentFocused(false);
  const handleReplyContentMouseOver = () => setIsReplyContentHovered(true);
  const handleReplyContentMouseOut = () => setIsReplyContentHovered(false);

  const calculateTitleBorderColor = () => {
    if (isReplyTitleFocused || isReplyTitleHovered) return borderColor;
    return `${borderColor}33`; // 20% opacity
  };

  const calculateTextBorderColor = () => {
    if (isReplyContentFocused || isReplyContentHovered) return borderColor;
    return `${borderColor}33`; // 20% opacity
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setReplyContent(newText);
    setCharacterCount(newText.length);
    setWordCount(newText ? newText.trim().split(/\s+/).length : 0);

    const val = event.target?.value;
    setReplyContent(val);
  };

  const submitReply = async () => {};

  if (!session?.user) {
    return <div>Loading...</div>;
  }

  const handleImageClick = (src: string) => {
    setOverlayImage(src);
    document.body.style.overflow = "hidden"; // Disable scrolling
  };

  const closeOverlay = () => {
    setOverlayImage(null);
    document.body.style.overflow = "auto"; // Enable scrolling
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeOverlay();
    }
  };

  // const timestamp = getTimestamp(comment.createdAt, comment.updatedAt);

  return (
    <div className="mb-[100px] mt-[90px] flex justify-center">
      <div className="flex w-[800px] flex-col gap-[30px]">
        <h1 className="text-2xl font-semibold">Send Reply</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col gap-[20px]">
          <input
            type="text"
            placeholder="Title of comment..."
            value={replyTitle}
            onChange={handleTitleChange}
            onFocus={handleReplyTitleFocus}
            onBlur={handleReplyTitleBlur}
            onMouseOver={handleReplyTitleMouseOver}
            onMouseOut={handleReplyTitleMouseOut}
            className="w-full rounded-xl border-2 bg-transparent p-[15px] outline-none transition duration-200 ease-in-out"
            style={{
              borderColor: calculateTitleBorderColor(),
              borderWidth: "2px",
            }}
          />
          <textarea
            placeholder="Write your comment here..."
            value={replyContent}
            onChange={handleTextChange}
            ref={textareaRef}
            onFocus={handleReplyContentFocus}
            onBlur={handleReplyContentBlur}
            onMouseOver={handleReplyContentMouseOver}
            onMouseOut={handleReplyContentMouseOut}
            className="min-h-[200px] w-full rounded-xl border-2 bg-transparent p-[15px] outline-none transition duration-200 ease-in-out"
            style={{
              borderColor: calculateTextBorderColor(),
              borderWidth: "2px",
            }}
          />
          <div className="flex items-center justify-between gap-[30px]">
            <div className="flex gap-[30px]">
              <p className="text-white/50">Character count: {characterCount}</p>
              <p className="text-white/50">Word count: {wordCount}</p>
            </div>
            <div className="flex gap-[30px]">
              <button
                onClick={() => {}}
                className="w-[100px] rounded-xl py-[12px] text-center font-semibold text-green-500 transition duration-150 ease-in-out hover:bg-green-700 hover:text-white"
              >
                Save Draft
              </button>
              <PrimaryButton onClick={submitReply} disabled={isLoading}>
                {isLoading ? "Publishing..." : "Publish"}
              </PrimaryButton>
              {/* Show warning modal before cancelling */}
              <DangerButton onClick={() => router.back()} type="button">
                Cancel
              </DangerButton>
            </div>
          </div>
        </div>
        <div className="h-[1px] w-full bg-white/5"></div>
        <div>
          <div className="mb-[20px] flex items-center justify-between">
            <h1 className="mb-[20px] font-bold text-white/50">
              Preview Comment
            </h1>
            <div className="opacity-50 transition-opacity duration-150 ease-in-out hover:opacity-100">
              <ToggleSwitch
                label={
                  <span className="text-sm font-semibold">Show comment</span>
                }
                checked={showParentComment}
                onChange={() => setShowParentComment(!showParentComment)}
              />
            </div>
          </div>
          <div className="flex w-[90%] flex-col gap-[10px] border-lightBorder transition duration-200 hover:border-lightBorderHover dark:border-darkBorder dark:hover:border-darkBorderHover sm:w-[800px] sm:rounded-[15px] sm:border sm:p-[15px]">
            {showParentComment && comment && (
              <CommentTemplate
                id={comment.id}
                user={comment.user}
                createdAt={comment.createdAt}
                updatedAt={comment.updatedAt}
                timestamp={comment.updatedAt || comment.createdAt}
                title={comment.title}
                content={comment.content}
                initialLikesCount={likesCount}
                userLiked={liked}
              />
            )}
            <CommentTemplate
              id={session?.user.id || ""}
              user={session?.user}
              createdAt={formatDate(new Date().toISOString())}
              updatedAt={formatDate(new Date().toISOString())}
              timestamp={new Date().toISOString()}
              title={replyTitle}
              content={parseTextWithMedia(replyContent, handleImageClick)}
              initialLikesCount={0}
              userLiked={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
