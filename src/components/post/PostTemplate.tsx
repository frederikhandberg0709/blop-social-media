/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import PostActionButtons from "../buttons/PostActionButtons";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CommentTemplate from "../CommentTemplate";
import PostDropdownMenu from "../menus/PostDropdownMenu";
import { parseTextWithMedia } from "@/utils/parseTextWithMedia";
import { PostProps } from "@/types/PostProps";
import { formatDate } from "@/utils/formattedDate";
import AnimateHeight from "react-animate-height";
import ProfilePicture from "../ProfilePicture";

const PostTemplate: React.FC<PostProps> = ({
  id,
  user,
  timestamp,
  title,
  content,
  imageContent,
  videoContent,
  initialLikesCount,
  userLiked,
}) => {
  const { data: session } = useSession();
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [liked, setLiked] = useState(userLiked);
  const [comments, setComments] = useState<any[]>([]);
  const [commentSectionHeight, setCommentSectionHeight] = useState<
    number | "auto"
  >(0);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikesCount = async () => {
      try {
        const userId = session?.user?.id;
        const response = await fetch(
          `/api/likes-count-post?postId=${id}&userId=${userId}`,
        );
        const data = await response.json();
        setLikesCount(data.likesCount);
        setLiked(data.userLiked);
      } catch (error) {
        console.error("Error fetching likes count:", error);
      }
    };

    fetchLikesCount();
  }, [id, session?.user?.id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/fetch-all-comments?postId=${id}`);
        const data = await response.json();
        setComments(data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [id]);

  const handleLike = async () => {
    if (!session) {
      return alert("You need to be logged in to like posts");
    }

    try {
      const response = await fetch("/api/like-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: id, userId: session.user.id }),
      });

      if (response.ok) {
        setLikesCount(likesCount + 1);
        setLiked(true);
      } else {
        console.error("Failed to like post");
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleUnlike = async () => {
    if (!session) {
      return alert("You need to be logged in to unlike posts");
    }
    try {
      const response = await fetch("/api/unlike-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: id, userId: session.user.id }),
      });

      if (response.ok) {
        setLikesCount(likesCount - 1);
        setLiked(false);
      } else {
        console.error("Failed to unlike post");
      }
    } catch (error) {
      console.error("Error unliking post:", error);
    }
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

  const parsedContent =
    typeof content === "string"
      ? parseTextWithMedia(content, handleImageClick)
      : content;

  if (!user) {
    return null; // or some kind of loading indicator or placeholder
  }

  return (
    <div className="flex w-[90%] flex-col gap-[10px] border-lightBorder transition duration-200 hover:border-lightBorderHover dark:border-darkBorder dark:hover:border-darkBorderHover sm:w-[800px] sm:rounded-[15px] sm:border sm:p-[15px]">
      <div className="flex items-center justify-between">
        <Link
          href={`/profile/${user.username}`}
          className="group flex items-center gap-[10px]"
        >
          <ProfilePicture
            src={user.profilePicture}
            alt={`${user.profileName}'s profile picture`}
          />
          <div className="flex flex-col gap-[1px]">
            {/* If user has profile name */}
            {user.profileName ? (
              <>
                <div className="text-[15px] font-bold group-hover:text-blue-500">
                  {user.profileName}
                </div>
                <div className="text-[12px] text-gray-500">
                  @{user.username}
                </div>
              </>
            ) : (
              // No profile name, only show username
              <>
                <div className="text-[15px] font-bold group-hover:text-blue-500">
                  {user.username}
                </div>
                <div className="text-[12px] text-gray-500">
                  @{user.username}
                </div>
              </>
            )}
          </div>
        </Link>
        <div className="flex items-center gap-[15px]">
          <div className="text-right text-[15px] text-gray-500">
            {formatDate(timestamp)}
          </div>
          {/* Dropdown menu */}
          <PostDropdownMenu
            postId={id}
            authorId={user.id}
            authorUsername={user.username}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {title && <h1 className="text-xl font-bold">{title}</h1>}
        <p className="text-base leading-normal">{parsedContent}</p>
      </div>
      <PostActionButtons
        likesCount={likesCount}
        commentsCount={comments.length}
        onCommentClick={() =>
          setCommentSectionHeight(commentSectionHeight === 0 ? "auto" : 0)
        }
        sharesCount={0}
        donationCount={0}
        liked={liked}
        onLike={handleLike}
        onUnlike={handleUnlike}
      />
      <AnimateHeight duration={500} height={commentSectionHeight}>
        <>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Comments</h2>
              <span className="text-xl font-bold text-primaryGray">·</span>
              <p className="text-xl text-primaryGray">{comments.length}</p>
            </div>
            <div className="mt-3 flex flex-col items-start gap-2">
              <div className="flex flex-col items-start gap-4">
                <Link
                  href={`/profile/${session?.user.username}`}
                  className="group flex items-center gap-[10px]"
                >
                  <img
                    src={session?.user.profilePicture || ""}
                    alt={`${session?.user.profileName}'s profile picture`}
                    className="h-[40px] w-[40px] rounded-full object-cover"
                  />
                  <div className="flex flex-col gap-[1px]">
                    {/* If user has profile name */}
                    {session?.user.profileName ? (
                      <>
                        <div className="text-[15px] font-bold group-hover:text-blue-500">
                          {session?.user.profileName}
                        </div>
                        <div className="text-[12px] text-gray-500">
                          @{session?.user.username}
                        </div>
                      </>
                    ) : (
                      // No profile name, only show username
                      <>
                        <div className="text-[15px] font-bold group-hover:text-blue-500">
                          {session?.user.username}
                        </div>
                        <div className="text-[12px] text-gray-500">
                          @{session?.user.username}
                        </div>
                      </>
                    )}
                  </div>
                </Link>
                <Link
                  href={`/send-comment/${id}`}
                  className="rounded-full bg-blue-600 px-2 py-1 text-sm font-semibold text-white transition duration-150 ease-in-out hover:bg-hoverBlue"
                >
                  Send a comment?
                </Link>
              </div>
              <div className="mt-5 flex w-full flex-col gap-5">
                {comments?.map((comment) => (
                  <CommentTemplate
                    key={comment.id}
                    id={comment.id}
                    user={comment.user}
                    title={comment.title}
                    content={comment.content}
                    createdAt={comment.createdAt}
                    updatedAt={comment.updatedAt}
                    timestamp={comment.createdAt}
                    replies={comment.replies || []}
                    initialLikesCount={comment.likesCount}
                    userLiked={comment.userLiked}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      </AnimateHeight>
      {/* Fullscreen  image overlay */}
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
};

export default PostTemplate;
