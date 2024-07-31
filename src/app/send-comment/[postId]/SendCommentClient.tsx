"use client";

import DangerButton from "@/components/buttons/DangerButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import CommentTemplate from "@/components/CommentTemplate";
import PostTemplate from "@/components/post/PostTemplate";
import useAutosizeTextArea from "@/hooks/useAutosizeTextArea";
import useUserColor from "@/hooks/useUserColor";
import { PostProps } from "@/types/PostProps";
import { formatDate } from "@/utils/formattedDate";
import { parseTextWithMedia } from "@/utils/parseTextWithMedia";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SendCommentClient({ post }: { post: PostProps }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { postId, parentId } = useParams<{
    postId: string;
    parentId?: string;
  }>();
  const [commentTitle, setCommentTitle] = useState<string>("");
  const [commentContent, setCommentContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [wordCount, setWordCount] = useState<number>(0);
  const [parentComment, setParentComment] = useState<any>(null);
  const [isCommentTitleFocused, setIsCommentTitleFocused] =
    useState<boolean>(false);
  const [isCommentTitleHovered, setIsCommentTitleHovered] =
    useState<boolean>(false);
  const [isCommentContentFocused, setIsCommentContentFocused] =
    useState<boolean>(false);
  const [isCommentContentHovered, setIsCommentContentHovered] =
    useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const borderColor = useUserColor();

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentTitle(event.target.value);
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

  const calculateTitleBorderColor = () => {
    if (isCommentTitleFocused || isCommentTitleHovered) return borderColor;
    return `${borderColor}33`; // 20% opacity
  };

  const calculateTextBorderColor = () => {
    if (isCommentContentFocused || isCommentContentHovered) return borderColor;
    return `${borderColor}33`; // 20% opacity
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setCommentContent(newText);
    setCharacterCount(newText.length);
    setWordCount(newText ? newText.trim().split(/\s+/).length : 0);

    const val = event.target?.value;
    setCommentContent(val);
  };

  // useEffect(() => {
  //   const fetchPost = async () => {
  //     try {
  //       const response = await fetch(`/api/fetch-post/${postId}`);

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch post");
  //       }
  //       const data = await response.json();
  //       if (data && data.post) {
  //         setPost(data.post);
  //       } else {
  //         console.error("Post data is not structured as expected");
  //       }
  //       console.log("Fetched post:", data);
  //       setPost(data.post);
  //     } catch (error) {
  //       console.error("Error fetching post:", error);
  //     }
  //   };

  //   console.log(postId);

  //   const fetchParentComment = async () => {
  //     if (parentId) {
  //       try {
  //         const response = await fetch(`/api/fetch-comment/${parentId}`);
  //         if (!response.ok) {
  //           throw new Error("Failed to fetch parent comment");
  //         }
  //         const data = await response.json();
  //         setParentComment(data.comment);
  //       } catch (error) {
  //         console.error("Error fetching parent comment:", error);
  //       }
  //     }
  //   };

  //   fetchPost();
  //   fetchParentComment();
  // }, [postId, parentId]);

  const submitComment = async () => {
    if (!commentContent.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/send-comment/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentId: parentId ?? null,
          commentTitle,
          commentContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send comment");
      }

      const comment = await response.json();
      console.log("Comment created:", comment);
      router.push(`/post/${postId}`);
    } catch (error) {
      setError((error as Error).message);
      console.error("Error sending comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Current post state:", post); // Log the current state of post
  }, [post]);

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
            className="w-full rounded-xl border-2 bg-transparent p-[15px] outline-none transition duration-200 ease-in-out"
            style={{
              borderColor: calculateTitleBorderColor(),
              borderWidth: "2px",
            }}
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
              <PrimaryButton onClick={submitComment} disabled={isLoading}>
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
          <h1 className="mb-[20px] font-bold text-white/50">Preview Comment</h1>
          {post && (
            <div>
              <PostTemplate
                key={post.id}
                id={post.id}
                user={post.user}
                createdAt={post.createdAt}
                updatedAt={post.updatedAt}
                timestamp={formatDate(post.updatedAt || post.createdAt)}
                title={post.title}
                content={post.content}
                initialLikesCount={post.initialLikesCount ?? 0}
                userLiked={post.userLiked}
              />
            </div>
          )}
          {/* <CommentTemplate
              id={parentComment.id}
              profilePicture={parentComment.profilePicture}
              profileName={parentComment.profileName}
              username={parentComment.username}
              timestamp={parentComment.timestamp}
              title={parentComment.title}
              content={parseTextWithMedia(parentComment.content)}
              initialLikesCount={parentComment.initialLikesCount}
              userLiked={parentComment.userLiked}
            /> */}
          <CommentTemplate
            id={session?.user.id || ""}
            profilePicture={null}
            profileName={
              session?.user.profileName || session?.user.username || ""
            }
            username={session?.user.username || ""}
            timestamp={new Date().toISOString()}
            title={commentTitle}
            content={parseTextWithMedia(commentContent)}
            initialLikesCount={0}
            userLiked={false}
          />
        </div>
        {/* Show comment being replied to */}
        {/* Show preview of the comment being created */}
      </div>
    </div>
  );
}
