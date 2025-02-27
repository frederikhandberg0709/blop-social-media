/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import PostActionButtons from "../buttons/PostActionButtons";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import CommentTemplate from "../CommentTemplate";
import PostDropdownMenu from "../menus/PostDropdownMenu";
import { parseTextWithEnhancements } from "@/utils/parseTextWithEnhancements";
import { Post, SharedPost, OriginalPost } from "@/types/components/post";
import { formatDate } from "@/utils/formattedDate";
import AnimateHeight from "react-animate-height";
import ProfilePicture from "../ProfilePicture";
import PostShareMenu from "../menus/PostShareMenu";
import { useRouter } from "next/navigation";
import QuotedTemplate from "./QuotedTemplate";
import { useCreateLike } from "@/hooks/api/likes/useCreateLike";
import { useDeleteLike } from "@/hooks/api/likes/useDeleteLike";
import { useLikeCount } from "@/hooks/api/likes/useLikes";
import { useComments } from "@/hooks/api/comments/useComments";
import { useCreateShare } from "@/hooks/api/shares/useCreateShare";
import { useDeleteShare } from "@/hooks/api/shares/useDeleteShare";
import { useShareStatus } from "@/hooks/api/shares/useShareStatus";
import { useShareCount } from "@/hooks/api/shares/useShares";
import { usePosts } from "@/hooks/api/posts/usePosts";
import { extractQuotedPostIds } from "@/utils/extractQuotedPostIds";

const PostTemplate: React.FC<Post> = (props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const isShared = props.type === "shared";
  const sharedPost = isShared ? (props as SharedPost) : null;
  const post = isShared ? sharedPost!.originalPost : (props as OriginalPost);
  const [commentSectionHeight, setCommentSectionHeight] = useState<0 | "auto">(
    0,
  );
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  const {
    data: commentsData,
    isPending: isPendingComments,
    error: commentsError,
  } = useComments(post.id);

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
    type: "post",
    id: post.id,
  });

  const {
    mutate: createShare,
    isPending: isCreatingShare,
    error: createShareError,
  } = useCreateShare();

  const {
    mutate: deleteShare,
    isPending: isDeletingShare,
    error: deleteShareError,
  } = useDeleteShare();

  const { data: shareStatus } = useShareStatus({
    type: "post",
    id: post.id,
  });

  const { data: shareCount } = useShareCount({ id: post.id, type: "post" });

  const quotedPostIds = extractQuotedPostIds(post.content);
  const { posts: quotedPosts, isLoading } = usePosts({
    postIds: quotedPostIds,
    enabled: quotedPostIds.length > 0,
  });

  const quotedPostsMap = React.useMemo(() => {
    return new Map(quotedPosts?.map((post) => [post?.id, post]));
  }, [quotedPosts]);

  const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsShareMenuOpen(!isShareMenuOpen);
  };

  const handleShareToggle = async () => {
    if (shareStatus?.hasShared) {
      deleteShare({
        id: post.id,
        shareId: shareStatus.shareId,
        type: "post",
      });
    } else {
      createShare({ id: post.id, type: "post" });
    }
  };

  const handleQuote = () => {
    setIsShareMenuOpen(false);

    router.push(`/create-post?postId=${props.id}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isShareMenuOpen &&
        shareMenuRef.current &&
        shareButtonRef.current &&
        !shareMenuRef.current.contains(event.target as Node) &&
        !shareButtonRef.current.contains(event.target as Node)
      ) {
        setIsShareMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isShareMenuOpen]);

  useEffect(() => {
    if (isShareMenuOpen && shareButtonRef.current && shareMenuRef.current) {
      const buttonRect = shareButtonRef.current.getBoundingClientRect();

      shareMenuRef.current.style.position = "absolute";
      shareMenuRef.current.style.top = `${buttonRect.bottom + window.scrollY}px`;
      shareMenuRef.current.style.left = `${buttonRect.left + window.scrollX}px`;
    }
  }, [isShareMenuOpen]);

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
    typeof post.content === "string"
      ? parseTextWithEnhancements(post.content, handleImageClick)
      : post.content;

  if (!post.user) {
    return null;
  }

  const renderContent = () => {
    if (quotedPostIds.length === 0) {
      return <p className="text-base leading-normal">{parsedContent}</p>;
    }

    const originalContent =
      typeof post.content === "string" ? post.content : "";

    const regex = new RegExp(
      `${window.location.origin}/post/([a-zA-Z0-9-_]+)`,
      "g",
    );
    const parts = originalContent.split(regex);

    return (
      <>
        {parts.map((part: string, index: number) => {
          const quotedPost = quotedPostsMap.get(
            quotedPostIds[Math.floor(index / 2)],
          );

          if (index % 2 === 1) {
            return isLoading ? (
              <p key={index} className="text-gray-500">
                Loading quoted post...
              </p>
            ) : quotedPost ? (
              <QuotedTemplate
                key={quotedPost.id}
                id={quotedPost.id}
                user={quotedPost.user}
                title={quotedPost.title}
                content={quotedPost.content}
                createdAt={quotedPost.createdAt}
              />
            ) : null;
          }

          return (
            <p key={index} className="text-base leading-normal">
              {parseTextWithEnhancements(part, handleImageClick)}
            </p>
          );
        })}
      </>
    );
  };

  return (
    <div className="border-lightBorder hover:border-lightBorderHover dark:border-darkBorder dark:hover:border-darkBorderHover w-[90%] transition duration-200 sm:w-[800px] sm:rounded-2xl sm:border sm:p-[15px]">
      <div className="flex flex-col gap-[10px]">
        {/* Only show if post is shared */}
        {isShared && sharedPost && (
          <p className="text-primaryGray text-sm">
            Shared by{" "}
            <Link
              href={`/profile/${sharedPost.sharedBy.username}`}
              className="font-bold hover:text-black hover:underline dark:hover:text-white"
            >
              {sharedPost.sharedBy.profileName ||
                `@${sharedPost.user.username}`}
            </Link>{" "}
            <span>· {formatDate(sharedPost.sharedAt || "")}</span>
          </p>
        )}
        <div className="flex items-center justify-between">
          <Link
            href={`/profile/${post.user.username}`}
            className="group flex items-center gap-[10px]"
          >
            <ProfilePicture
              src={post.user.profilePicture}
              alt={`${post.user.profileName}'s profile picture`}
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
              {formatDate(!post.updatedAt ? post.createdAt : post.updatedAt)}
            </div>
            {/* Dropdown menu */}
            <PostDropdownMenu
              postId={post.id}
              authorId={post.user.id}
              authorUsername={post.user.username}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {post.title && <h1 className="text-xl font-bold">{post.title}</h1>}
          {renderContent()}
          {/* <p className="text-base leading-normal">{parsedContent}</p> */}
        </div>
        <PostActionButtons
          likesCount={likesData?.likesCount ?? post.initialLikesCount}
          commentsCount={commentsData?.comments.length ?? 0}
          onCommentClick={() =>
            setCommentSectionHeight(commentSectionHeight === 0 ? "auto" : 0)
          }
          sharesCount={shareCount?.sharesCount ?? 0}
          onShareClick={handleShareClick}
          shareButtonRef={shareButtonRef}
          liked={likesData?.userLiked ?? post.userLiked}
          onLike={() => createLike({ type: "post", id: post.id })}
          onUnlike={() => deleteLike({ type: "post", id: post.id })}
        />
      </div>
      {isShareMenuOpen && (
        <div ref={shareMenuRef}>
          <PostShareMenu
            postId={post.id}
            onShare={handleShareToggle}
            onQuote={handleQuote}
            userHasShared={shareStatus?.hasShared ?? false}
          />
        </div>
      )}
      <AnimateHeight duration={500} height={commentSectionHeight}>
        <div className="mt-2.5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Comments</h2>
            <span className="text-primaryGray text-xl font-bold">·</span>
            <p className="text-primaryGray text-xl">
              {commentsData?.comments.length || 0}
            </p>
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
                href={`/send-comment/${post.id}`}
                className="hover:bg-hoverBlue rounded-full bg-blue-600 px-2 py-1 text-sm font-semibold text-white transition duration-150 ease-in-out"
              >
                Send a comment?
              </Link>
            </div>
            <div className="mt-5 flex w-full flex-col gap-5">
              {commentsData?.comments?.length === 0 ? (
                <p className="text-md text-gray-500">No comments yet...</p>
              ) : (
                commentsData?.comments.map((comment) => (
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
                    initialLikesCount={comment.initialLikesCount}
                    userLiked={comment.userLiked}
                  />
                ))
              )}
            </div>
          </div>
        </div>
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
