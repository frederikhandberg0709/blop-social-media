"use client";

import Link from "next/link";
import { formatDate } from "@/utils/formattedDate";
import { useEffect, useState } from "react";
import CommentActionButtons from "./buttons/CommentActionButtons";
import { useSession } from "next-auth/react";
import React from "react";
import CommentDropdownMenu from "./menus/CommentDropdownMenu";
import { parseTextWithEnhancements } from "@/utils/parseTextWithEnhancements";
import { useRouter } from "next/navigation";
import { CommentProps } from "@/types/CommentProps";
import { useCommentLikes } from "@/hooks/api/queries/useLikesQueries";
import { useCommentLikeMutation } from "@/hooks/api/mutations/useLikeMutation";

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
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const [sharesCount, setSharesCount] = useState<number>(0);
  const { data: likesData } = useCommentLikes(id);
  const { mutate: toggleLike } = useCommentLikeMutation();

  const handleLikeToggle = async () => {
    const action = likesData?.userLiked ? "unlike" : "like";
    toggleLike({ id, action });
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
    typeof content === "string" ? parseTextWithEnhancements(content) : content;

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
            {/* {formatDate(!updatedAt ? createdAt : updatedAt)} */}
          </div>
          {/* Dropdown menu */}
          <CommentDropdownMenu authorId={user.id} commentId={id} />
        </div>
      </div>
      {title && <h1 className="text-base font-bold">{title}</h1>}
      <div className="text-sm leading-normal">{parsedContent}</div>
      <div className="mt-1">
        <CommentActionButtons
          likesCount={likesData?.likesCount ?? initialLikesCount}
          commentsCount={commentsCount}
          onCommentClick={handleReplyClick}
          sharesCount={sharesCount}
          donationCount={0} // Implement later. Maybe crypto donations?
          liked={likesData?.userLiked ?? userLiked}
          onLike={handleLikeToggle}
          onUnlike={handleLikeToggle}
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
