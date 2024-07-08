"use client";

import Link from "next/link";
import PostReactionBtns from "../buttons/PostReactionBtns";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface PostProps {
  id: string;
  profilePicture: string | null;
  profileName: string | null;
  username: string;
  timestamp: string;
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
  textContent,
  imageContent,
  videoContent,
  initialLikesCount,
  userLiked,
}) => {
  const { data: session } = useSession();
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [liked, setLiked] = useState(userLiked);

  useEffect(() => {
    const fetchLikesCount = async () => {
      try {
        const userId = session?.user?.id;
        const response = await fetch(
          `/api/likes-count?postId=${id}&userId=${userId}`
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

  return (
    <div className="flex flex-col gap-[10px] sm:w-[800px] w-[90%] sm:border border-gray-900 hover:border-gray-800 transition duration-200 bg-black sm:p-[15px] sm:rounded-[15px]">
      <div className="flex items-center justify-between">
        <Link
          href={`/profile/${username}`}
          className="flex items-center gap-[10px] group"
        >
          <img
            src={profilePicture || defaultProfilePicture}
            alt={`${profileName}'s profile picture`}
            className="rounded-full h-[40px] w-[40px] object-cover"
          />
          <div className="flex flex-col gap-[1px]">
            {/* If user has profile name */}
            {profileName ? (
              <>
                <div className="font-bold text-[13px] group-hover:text-blue-500">
                  {profileName}
                </div>
                <div className="text-[13px] text-gray-500">@{username}</div>
              </>
            ) : (
              // No profile name, only show username
              <div className="font-bold text-[15px] group-hover:text-blue-500">
                @{username}
              </div>
            )}
          </div>
        </Link>
        <div className="flex items-center gap-[15px]">
          <div className="text-[15px] text-right text-gray-500">
            {timestamp}
          </div>
          {/* Dropdown button */}
        </div>
      </div>
      <div className="flex flex-col gap-[10px]">
        <p className="text-[15px] leading-normal overflow-x-hidden">
          {parseTextWithMedia(textContent)}
        </p>
      </div>
      <PostReactionBtns
        likesCount={likesCount}
        commentsCount={0}
        sharesCount={0}
        donationCount={0}
        liked={liked}
        onLike={handleLike}
        onUnlike={handleUnlike}
      />
    </div>
  );
};

export default PostTemplate;
