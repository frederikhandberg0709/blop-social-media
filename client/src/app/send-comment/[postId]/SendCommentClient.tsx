"use client";

import PostActionButtons from "@/components/buttons/PostActionButtons";
import ToggleSwitch from "@/components/buttons/ToggleSwitch";
import CommentTemplate from "@/components/CommentTemplate";
import PostDropdownMenu from "@/components/menus/PostDropdownMenu";
import { useCreateComment } from "@/hooks/api/comments/useCreateComment";
import { usePost } from "@/hooks/api/posts/usePost";
import useAutosizeTextArea from "@/hooks/useAutosizeTextArea";
import { formatDate } from "@/utils/formattedDate";
import { getTimestamp } from "@/utils/getTimestamp";
import { parseTextWithEnhancements } from "@/utils/parseTextWithEnhancements";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Button from "@/components/buttons/Button";

interface SendCommentClientProps {
  postId: string;
  onCommentSubmitted?: () => void;
}

export default function SendCommentClient({
  postId,
  onCommentSubmitted,
}: SendCommentClientProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    data: post,
    isPending: isPostPending,
    error: postError,
  } = usePost({ postId });

  const createComment = useCreateComment();

  const [likesCount, setLikesCount] = useState(post?.initialLikesCount ?? 0);
  const [liked, setLiked] = useState(post?.userLiked ?? false);
  const [commentTitle, setCommentTitle] = useState<string>("");
  const [commentContent, setCommentContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [wordCount, setWordCount] = useState<number>(0);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [showPost, setShowPost] = useState(true);
  const [isCommentTitleFocused, setIsCommentTitleFocused] =
    useState<boolean>(false);
  const [isCommentTitleHovered, setIsCommentTitleHovered] =
    useState<boolean>(false);
  const [isCommentContentFocused, setIsCommentContentFocused] =
    useState<boolean>(false);
  const [isCommentContentHovered, setIsCommentContentHovered] =
    useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentTitle(event.target.value);
  };

  const submitComment = async () => {
    if (!commentContent.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      createComment.mutate({
        postId: post.id,
        title: commentTitle || undefined,
        content: commentContent,
      });

      setCommentTitle("");
      setCommentContent("");

      onCommentSubmitted?.();

      router.push(`/post/${post.id}`);
    } catch (error) {
      setError((error as Error).message);
      console.error("Error sending comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useAutosizeTextArea(textareaRef.current, commentContent);

  const handleCommentTitleFocus = () => setIsCommentTitleFocused(true);
  const handleCommentTitleBlur = () => setIsCommentTitleFocused(false);
  const handleCommentTitleMouseOver = () => setIsCommentTitleHovered(true);
  const handleCommentTitleMouseOut = () => setIsCommentTitleHovered(false);

  const handleCommentContentFocus = () => setIsCommentContentFocused(true);
  const handleCommentContentBlur = () => setIsCommentContentFocused(false);
  const handleCommentContentMouseOver = () => setIsCommentContentHovered(true);
  const handleCommentContentMouseOut = () => setIsCommentContentHovered(false);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setCommentContent(newText);
    setCharacterCount(newText.length);
    setWordCount(newText ? newText.trim().split(/\s+/).length : 0);

    const val = event.target?.value;
    setCommentContent(val);
  };

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

  if (isPostPending) {
    return <div>Loading...</div>;
  }

  if (postError || !post) {
    return <div>Error loading post</div>;
  }

  const parsedContent =
    typeof post.content === "string"
      ? parseTextWithEnhancements(post.content, handleImageClick)
      : post.content;

  const timestamp = getTimestamp(post.createdAt, post.updatedAt);

  return (
    <div className="mb-[100px] mt-[90px] flex justify-center">
      <div className="flex w-[800px] flex-col gap-[30px]">
        <h1 className="text-[25px] font-semibold">Send Comment</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col gap-[20px]">
          <input
            type="text"
            placeholder="Title of comment..."
            value={commentTitle}
            onChange={handleTitleChange}
            onFocus={handleCommentTitleFocus}
            onBlur={handleCommentTitleBlur}
            onMouseOver={handleCommentTitleMouseOver}
            onMouseOut={handleCommentTitleMouseOut}
            className="w-full rounded-xl border-2 border-blue-500/30 bg-transparent p-[15px] outline-none transition duration-200 ease-in-out hover:border-blue-500/75 focus:border-blue-500/75"
          />
          <textarea
            placeholder="Write your comment here..."
            value={commentContent}
            onChange={handleTextChange}
            ref={textareaRef}
            onFocus={handleCommentContentFocus}
            onBlur={handleCommentContentBlur}
            onMouseOver={handleCommentContentMouseOver}
            onMouseOut={handleCommentContentMouseOut}
            className="min-h-[200px] w-full rounded-xl border-2 border-blue-500/30 bg-transparent p-[15px] outline-none transition duration-200 ease-in-out hover:border-blue-500/75 focus:border-blue-500/75"
          />
          <div className="flex items-center justify-between gap-[30px]">
            <div className="flex gap-[30px]">
              <p className="text-white/50">Character count: {characterCount}</p>
              <p className="text-white/50">Word count: {wordCount}</p>
            </div>
            <div className="flex gap-[30px]">
              {/* TODO: Implement save draft functionality */}
              <button
                onClick={() => {}}
                className="w-[100px] rounded-xl py-[12px] text-center font-semibold text-green-500 transition duration-150 ease-in-out hover:bg-green-700 hover:text-white"
              >
                Save Draft
              </button>
              <Button
                onClick={submitComment}
                disabled={!commentContent.trim() || isLoading}
              >
                {isLoading ? "Publishing..." : "Publish"}
              </Button>
              {/* TODO: Show warning modal before cancelling */}
              <Button variant="danger" onClick={() => router.push("/home")}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
        <div className="h-[1px] w-full bg-white/5"></div>
        <div>
          <div className="mb-[20px] flex items-center justify-between">
            <h1 className="text-xl font-bold text-white/50">Preview Comment</h1>
            <div className="opacity-50 transition-opacity duration-150 ease-in-out hover:opacity-100">
              <ToggleSwitch
                label={<span className="text-sm font-semibold">Show post</span>}
                checked={showPost}
                onChange={() => setShowPost(!showPost)}
              />
            </div>
          </div>
          <div className="flex w-[90%] flex-col gap-[10px] border-lightBorder transition duration-200 hover:border-lightBorderHover dark:border-darkBorder dark:hover:border-darkBorderHover sm:w-[800px] sm:rounded-[15px] sm:border sm:p-[15px]">
            {showPost && (
              <>
                <div className="flex items-center justify-between">
                  <Link
                    href={`/profile/${post.user.username}`}
                    className="group flex items-center gap-[10px]"
                  >
                    <img
                      src={post.user.profilePicture || ""}
                      alt={`${post.user.profileName}'s profile picture`}
                      className="h-[40px] w-[40px] rounded-full object-cover"
                    />
                    <div className="flex flex-col gap-[1px]">
                      {/* If user has profile name */}
                      {post.user.profileName ? (
                        <>
                          <div className="text-[15px] font-bold group-hover:text-blue-500">
                            {post.user.profileName}
                          </div>
                          <div className="text-[12px] text-gray-500">
                            @{post.user.username}
                          </div>
                        </>
                      ) : (
                        // No profile name, only show username
                        <>
                          <div className="text-[15px] font-bold group-hover:text-blue-500">
                            {post.user.username}
                          </div>
                          <div className="text-[12px] text-gray-500">
                            @{post.user.username}
                          </div>
                        </>
                      )}
                    </div>
                  </Link>
                  <div className="flex items-center gap-[15px]">
                    <div className="text-right text-[15px] text-gray-500">
                      {/* {formatDate(post.timestamp)} */}
                      {timestamp}
                    </div>
                    {/* Dropdown menu */}
                    <PostDropdownMenu id={post.id} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {post.title && (
                    <h1 className="text-xl font-bold">{post.title}</h1>
                  )}
                  <p className="text-base leading-normal">{parsedContent}</p>
                </div>
                <PostActionButtons
                  likesCount={post.likesCount}
                  commentsCount={post.commentsCount}
                  onCommentClick={() => {}}
                  sharesCount={0}
                  liked={liked}
                  onLike={() => {}}
                  onUnlike={() => {}}
                />
              </>
            )}
            <CommentTemplate
              id={session?.user.id || ""}
              user={session?.user}
              createdAt={formatDate(new Date().toISOString())}
              updatedAt={formatDate(new Date().toISOString())}
              timestamp={new Date().toISOString()}
              title={commentTitle}
              content={parseTextWithEnhancements(commentContent, () => {})}
              initialLikesCount={0}
              userLiked={false}
            />
          </div>
        </div>
      </div>
      {overlayImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={handleOverlayClick}
        >
          <div className="relative max-h-full max-w-full overflow-hidden">
            <button
              className="absolute right-0 top-0 m-4 rounded-full bg-black/50 px-2 py-1 font-semibold text-white hover:bg-black/95"
              onClick={closeOverlay}
            >
              Close
            </button>
            <img
              src={overlayImage}
              alt="Fullscreen"
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] max-w-[90vw] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
