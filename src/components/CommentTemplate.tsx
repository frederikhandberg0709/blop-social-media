"use client";

import Link from "next/link";
import { formatDate } from "@/utils/formattedDate";
import { useEffect, useState } from "react";
import CommentActionButtons from "./buttons/CommentActionButtons";
import { useSession } from "next-auth/react";
import React from "react";
import CommentDropdownMenu from "./menus/CommentDropdownMenu";
import { parseTextWithMedia } from "@/utils/parseTextWithMedia";
import { useRouter } from "next/navigation";
import { CommentProps } from "@/types/CommentProps";

export default function CommentTemplate({
  id,
  user,
  createdAt,
  updatedAt,
  timestamp,
  title,
  content,
  imageContent,
  videoContent,
  replies = [],
  initialLikesCount,
  userLiked,
}: CommentProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [liked, setLiked] = useState(userLiked);
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
    router.push(`/send-reply/${id}`);
    // Implement reply functionality
    // Open new page with comment box
    console.log("Reply clicked");
  };

  const defaultProfilePicture =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg5CvxCysqjZrsTPUjcl5sN3HIzePiCWM7KQ&s";

  const parsedContent =
    typeof content === "string" ? parseTextWithMedia(content) : content;

  if (!user) {
    return "No comments right now...";
  }

  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex items-center justify-between">
        <Link
          href={`/profile/${user.username}`}
          className="group flex items-center gap-[10px]"
        >
          <img
            src={user?.profilePicture || defaultProfilePicture}
            alt={`${user?.profileName}'s profile picture`}
            className="h-[40px] w-[40px] rounded-full object-cover"
          />
          <div className="flex flex-col gap-[1px]">
            {/* If user has profile name */}
            {user?.profileName ? (
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
          <CommentDropdownMenu authorId={user.id} commentId={id} />
        </div>
      </div>
      {title && <h1 className="text-base font-bold">{title}</h1>}
      <div className="text-sm leading-normal">{parsedContent}</div>
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
      {replies.length > 0 && (
        <div className="mt-4 border-l-2 border-gray-200 pl-4">
          {replies.map((reply) => (
            <CommentTemplate key={reply.id} {...reply} />
          ))}
        </div>
      )}
    </div>
  );
}
