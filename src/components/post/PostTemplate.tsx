"use client";

import Link from "next/link";
import PostReactionButtons from "../buttons/PostReactionButtons";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { formatDate } from "@/utils/formattedDate";
import PostDropdownMenu from "../menus/PostDropdownMenu";
import CommentTemplate from "../CommentTemplate";

interface PostProps {
  id: string;
  profilePicture: string | null;
  profileName: string | null;
  username: string;
  timestamp: string;
  title: (string | React.ReactElement | React.ReactElement[])[];
  textContent: string;
  imageContent?: string;
  videoContent?: string;
  initialLikesCount: number;
  userLiked: boolean;
}

const PostTemplate: React.FC<PostProps> = ({
  id,
  profilePicture,
  profileName,
  username,
  timestamp,
  title,
  textContent,
  imageContent,
  videoContent,
  initialLikesCount,
  userLiked,
}) => {
  const { data: session } = useSession();
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [liked, setLiked] = useState(userLiked);
  const [comments, setComments] = useState<any[]>([]);
  const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);

  useEffect(() => {
    const fetchLikesCount = async () => {
      try {
        const userId = session?.user?.id;
        const response = await fetch(
          `/api/likes-count?postId=${id}&userId=${userId}`,
        );
        const data = await response.json();
        setLikesCount(data.likesCount);
        setLiked(data.userLiked);
      } catch (error) {
        console.error("Error fetching likes count:", error);
      }
    };

    fetchLikesCount();
  }, [id]);

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

  const defaultProfilePicture =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg5CvxCysqjZrsTPUjcl5sN3HIzePiCWM7KQ&s";

  const parseTextWithMedia = (inputText: string | undefined) => {
    if (!inputText) return null;

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

  return (
    <div className="dark:border-darkBorder dark:hover:border-darkBorderHover border-lightBorder hover:border-lightBorderHover flex w-[90%] flex-col gap-[10px] transition duration-200 sm:w-[800px] sm:rounded-[15px] sm:border sm:p-[15px]">
      <div className="flex items-center justify-between">
        <Link
          href={`/profile/${username}`}
          className="group flex items-center gap-[10px]"
        >
          <img
            src={profilePicture || defaultProfilePicture}
            alt={`${profileName}'s profile picture`}
            className="h-[40px] w-[40px] rounded-full object-cover"
          />
          <div className="flex flex-col gap-[1px]">
            {/* If user has profile name */}
            {profileName ? (
              <>
                <div className="text-[15px] font-bold group-hover:text-blue-500">
                  {profileName}
                </div>
                <div className="text-[12px] text-gray-500">@{username}</div>
              </>
            ) : (
              // No profile name, only show username
              <>
                <div className="text-[15px] font-bold group-hover:text-blue-500">
                  {username}
                </div>
                <div className="text-[12px] text-gray-500">@{username}</div>
              </>
            )}
          </div>
        </Link>
        <div className="flex items-center gap-[15px]">
          <div className="text-right text-[15px] text-gray-500">
            {timestamp}
          </div>
          {/* Dropdown button */}
          <PostDropdownMenu />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="overflow-x-hidden text-base leading-normal">
          {parseTextWithMedia(textContent)}
        </p>
      </div>
      <PostReactionButtons
        likesCount={likesCount}
        commentsCount={0}
        onCommentClick={() =>
          setIsCommentSectionVisible(!isCommentSectionVisible)
        }
        sharesCount={0}
        donationCount={0}
        liked={liked}
        onLike={handleLike}
        onUnlike={handleUnlike}
      />
      {isCommentSectionVisible && (
        <div className="flex flex-col gap-2">
          <h2 className="text-md font-bold text-black/50 dark:text-white/50">
            Comments
          </h2>
          <div className="flex flex-col items-start gap-2">
            <Link
              href={`/profile/${session?.user.username}`}
              className="group flex items-center gap-[10px]"
            >
              <img
                src={session?.user.profilePicture || defaultProfilePicture}
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
              href={"/send-comment"}
              className="rounded-full bg-blue-600 px-2 py-1 text-sm font-bold text-white"
            >
              Send a comment?
            </Link>
            {comments.map((comment) => (
              <CommentTemplate
                key={comment.id}
                profilePicture={comment.user.profilePicture}
                profileName={comment.user.profileName}
                username={comment.user.username}
                content={comment.content}
                timestamp={formatDate(comment.createdAt)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostTemplate;
