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
import { CommentProps } from "@/types/components/comment";
import { useDeleteLike } from "@/hooks/api/likes/useDeleteLike";
import { useCreateLike } from "@/hooks/api/likes/useCreateLike";
import { useLikeCount } from "@/hooks/api/likes/useLikes";
import ProfilePicture from "@/components/ProfilePicture";
import AnimateHeight from "react-animate-height";

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
  children = [],
  nestingLevel = 0,
}: CommentProps & { nestingLevel?: number }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [sharesCount, setSharesCount] = useState<number>(0);
  const [showDeepReplies, setShowDeepReplies] = useState<boolean>(false);

  const {
    mutate: createLike,
    isPending: isCreatingLike,
    error: createLikeError,
  } = useCreateLike();
  const {
    mutate: deleteLike,
    isPending: isDeletingLike,
    error: deleteLikeError,
  } = useDeleteLike();
  const { data: likesData } = useLikeCount({
    type: "comment",
    id: id,
  });

  const handleReplyClick = () => {
    router.push(`/send-reply/${id}?replyToId=${id}`);
  };

  const parsedContent =
    typeof content === "string" ? parseTextWithEnhancements(content) : content;

  const allReplies = children.length > 0 ? children : replies;

  const visibleReplies = showDeepReplies ? allReplies : allReplies;

  const hasDeepReplies =
    nestingLevel >= 3 && allReplies.length > 0 && !showDeepReplies;

  const indentClass =
    nestingLevel > 0
      ? "ml-6 border-l-2 border-gray-600 dark:border-gray-700 pl-4"
      : "";

  if (!user) {
    return "No comments right now...";
  }

  return (
    <div
      className={`flex w-full flex-col gap-1 ${nestingLevel > 0 ? "mt-4" : ""}`}
    >
      <div className="flex items-center justify-between">
        <Link
          href={`/profile/${user.username}`}
          className="group flex items-center gap-[10px]"
        >
          <ProfilePicture
            src={user?.profilePicture}
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
            {formatDate(!updatedAt ? createdAt : updatedAt)}
          </div>
          {/* Dropdown menu */}
          <CommentDropdownMenu
            authorId={user.id}
            commentId={id}
            authorUsername={user.username}
          />
        </div>
      </div>
      {title && <h1 className="text-base font-bold">{title}</h1>}
      <div className="text-sm leading-normal">{parsedContent}</div>
      <div className="mt-1">
        <CommentActionButtons
          likesCount={likesData?.likesCount ?? initialLikesCount}
          // commentsCount={commentsCount}
          commentsCount={allReplies.length}
          onCommentClick={handleReplyClick}
          sharesCount={sharesCount}
          liked={likesData?.userLiked ?? userLiked}
          onLike={() => createLike({ type: "comment", id })}
          onUnlike={() => deleteLike({ type: "comment", id })}
        />
      </div>
      {allReplies.length > 0 && (
        <div className={`mt-3 ${indentClass}`}>
          {nestingLevel <= 2 &&
            visibleReplies.map((reply) => (
              <CommentTemplate
                key={reply.id}
                id={reply.id}
                user={reply.user}
                createdAt={reply.createdAt}
                updatedAt={reply.updatedAt}
                timestamp={reply.timestamp || reply.createdAt}
                title={reply.title}
                content={reply.content}
                imageContent={reply.imageContent}
                videoContent={reply.videoContent}
                initialLikesCount={reply.initialLikesCount}
                userLiked={reply.userLiked}
                children={reply.children || []}
                nestingLevel={nestingLevel + 1}
              />
            ))}

          {nestingLevel >= 3 && (
            <>
              {showDeepReplies
                ? visibleReplies.map((reply) => (
                    <CommentTemplate
                      key={reply.id}
                      id={reply.id}
                      user={reply.user}
                      createdAt={reply.createdAt}
                      updatedAt={reply.updatedAt}
                      timestamp={reply.timestamp || reply.createdAt}
                      title={reply.title}
                      content={reply.content}
                      imageContent={reply.imageContent}
                      videoContent={reply.videoContent}
                      initialLikesCount={reply.initialLikesCount}
                      userLiked={reply.userLiked}
                      children={reply.children || []}
                      nestingLevel={nestingLevel + 1}
                    />
                  ))
                : allReplies.length > 0 && (
                    <button
                      onClick={() => setShowDeepReplies(true)}
                      className="mt-2 text-sm font-medium text-blue-500 hover:text-blue-700"
                    >
                      Show {allReplies.length} more{" "}
                      {allReplies.length === 1 ? "reply" : "replies"}
                    </button>
                  )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
