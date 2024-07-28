"use client";

import Link from "next/link";
import { formatDate } from "@/utils/formattedDate";
import { useEffect, useState } from "react";
import PostDropdownMenu from "./menus/PostDropdownMenu";
import CommentActionButtons from "./buttons/CommentActionButtons";
import { useSession } from "next-auth/react";
import React from "react";

interface CommentProps {
  id: string;
  profilePicture: string | null;
  profileName: string | null;
  username: string;
  timestamp: string;
  title?: string;
  content: string;
  imageContent?: string;
  videoContent?: string;
}

export default function CommentTemplate({
  id,
  profilePicture,
  profileName,
  username,
  timestamp,
  title,
  content,
  imageContent,
  videoContent,
}: CommentProps) {
  const { data: session } = useSession();
  const [likesCount, setLikesCount] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const [sharesCount, setSharesCount] = useState<number>(0);

  useEffect(() => {
    const fetchLikesCount = async () => {
      try {
        const response = await fetch(
          `/api/likes-count-comment?commentId=${id}&userId=${session?.user.id}`,
        );
        const data = await response.json();
        setLikesCount(data.likesCount);
        setLiked(data.userLiked);
      } catch (error) {
        console.error("Error fetching likes count:", error);
      }
    };

    fetchLikesCount();
  }, [id, session?.user.id]);

  const handleLike = async () => {
    if (!session) {
      return alert("You need to be logged in to like comments");
    }

    try {
      const response = await fetch("/api/like-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId: id, userId: session.user.id }),
      });

      if (response.ok) {
        setLikesCount(likesCount + 1);
        setLiked(true);
      } else {
        console.error("Failed to like comment");
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleUnlike = async () => {
    if (!session) {
      return alert("You need to be logged in to unlike comments");
    }

    try {
      const response = await fetch("/api/unlike-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId: id, userId: session.user.id }),
      });

      if (response.ok) {
        setLikesCount(likesCount - 1);
        setLiked(false);
      } else {
        console.error("Failed to unlike comment");
      }
    } catch (error) {
      console.error("Error unliking comment:", error);
    }
  };

  const handleReplyClick = () => {
    // Implement reply functionality
    // Open new page with comment box
    console.log("Reply clicked");
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
    <div className="flex w-full flex-col gap-1">
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
            {formatDate(timestamp)}
          </div>
          {/* Dropdown button */}
          <PostDropdownMenu />
        </div>
      </div>
      <div className="text-md font-semibold">{title}</div>
      <div className="text-sm leading-normal">
        {parseTextWithMedia(content)}
      </div>
      <div className="mt-1">
        <CommentActionButtons
          likesCount={likesCount}
          commentsCount={commentsCount}
          onCommentClick={handleReplyClick}
          sharesCount={sharesCount}
          donationCount={0} // Implement later. Maybe crypto donations?
          liked={liked}
          onLike={handleLike}
          onUnlike={handleUnlike}
        />
      </div>
    </div>
  );
}
