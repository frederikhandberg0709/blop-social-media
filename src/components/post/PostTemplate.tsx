/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import PostActionButtons from "../buttons/PostActionButtons";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import CommentTemplate from "../CommentTemplate";
import PostDropdownMenu from "../menus/PostDropdownMenu";
import { parseTextWithEnhancements } from "@/utils/parseTextWithEnhancements";
import {
  PostProps,
  SharedPostProps,
  OriginalPostProps,
} from "@/types/PostProps";
import { formatDate } from "@/utils/formattedDate";
import AnimateHeight from "react-animate-height";
import ProfilePicture from "../ProfilePicture";
import PostShareMenu from "../menus/PostShareMenu";
import { useRouter } from "next/navigation";
import QuotedTemplate from "./QuotedTemplate";
import { usePostLikes } from "@/hooks/api/useLikesQuery";
import { usePostLikeMutation } from "@/hooks/api/useLikeMutation";

const PostTemplate: React.FC<PostProps> = (props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const isShared = props.type === "shared";
  const sharedPost = isShared ? (props as SharedPostProps) : null;
  const post = isShared ? sharedPost!.post : (props as OriginalPostProps);
  const [comments, setComments] = useState<any[]>([]);
  const [commentSectionHeight, setCommentSectionHeight] = useState<0 | "auto">(
    0,
  );
  const [userHasShared, setUserHasShared] = useState(isShared);
  const [shareId, setShareId] = useState(isShared ? sharedPost!.id : null);
  const [sharesCount, setSharesCount] = useState(0);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  const { data: likesData, isLoading, error } = usePostLikes(post.id);
  const { mutate: toggleLike } = usePostLikeMutation();

  const extractQuotedPostId = (content: any): string | null => {
    if (typeof content === "string") {
      const match = content.match(/\/post\/([a-zA-Z0-9]+)/);
      return match ? match[1] : null;
    }
    if (Array.isArray(content)) {
      for (const item of content) {
        if (typeof item === "string") {
          const match = item.match(/\/post\/([a-zA-Z0-9]+)/);
          if (match) return match[1];
        }
      }
    }
    return null;
  };

  const quotedPostId = extractQuotedPostId(post.content);
  const [quotedPost, setQuotedPost] = useState<any | null>(null);

  const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsShareMenuOpen(!isShareMenuOpen);
  };

  // useEffect(() => {
  //   const fetchLikesCount = async () => {
  //     try {
  //       const userId = session?.user?.id;
  //       const response = await fetch(
  //         `/api/likes-count-post?postId=${post.id}&userId=${userId}`,
  //       );
  //       const data = await response.json();
  //       setLikesCount(data.likesCount);
  //       setLiked(data.userLiked);
  //     } catch (error) {
  //       console.error("Error fetching likes count:", error);
  //     }
  //   };

  //   fetchLikesCount();
  // }, [post.id, session?.user?.id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `/api/fetch-all-comments?postId=${post.id}`,
        );
        const data = await response.json();
        setComments(data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [post.id]);

  useEffect(() => {
    const fetchSharesCount = async () => {
      try {
        const response = await fetch(
          `/api/fetch-post-share-count?postId=${post.id}`,
        );
        const data = await response.json();
        setSharesCount(data.sharesCount);
      } catch (error) {
        console.error("Error fetching shares count:", error);
      }
    };

    fetchSharesCount();
  }, [post.id]);

  useEffect(() => {
    const fetchShareStatus = async () => {
      if (!session?.user) return;

      try {
        const response = await fetch(
          `/api/check-share-status?postId=${post.id}`,
        );
        const data = await response.json();
        setUserHasShared(data.hasShared);
        setShareId(data.shareId);
        setSharesCount(data.sharesCount);
      } catch (error) {
        console.error("Error fetching share status:", error);
      }
    };

    fetchShareStatus();
  }, [session?.user, post.id]);

  const handleLikeToggle = async () => {
    const action = likesData?.userLiked ? "unlike" : "like";
    toggleLike({ postId: post.id, action });
  };

  // TODO: Make into a custom hook
  const handleShare = async () => {
    if (!session) {
      return alert("You need to be logged in to share posts");
    }

    try {
      const response = await fetch("/api/share-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: post.id }),
      });

      if (response.ok) {
        alert("Post shared successfully!");
        // setSharesCount(sharesCount + 1);
        setSharesCount((prevCount) => prevCount + 1);
        setUserHasShared(true);
        setIsShareMenuOpen(false);
      } else {
        console.error("Failed to share post");
      }
    } catch (error) {
      console.error("Error sharing post:", error);
    }
  };

  const handleUnshare = async () => {
    if (!session || !isShared) return;

    try {
      const response = await fetch("/api/unshare-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shareId: shareId }),
      });

      if (response.ok) {
        setSharesCount((prevCount) => prevCount - 1);
        setUserHasShared(false);
        setIsShareMenuOpen(false);
        setIsDeleted(true);
      } else {
        console.error("Failed to unshare post");
      }
    } catch (error) {
      console.error("Error unsharing post:", error);
    }
  };

  const handleQuote = () => {
    setIsShareMenuOpen(false);

    router.push(`/quote-post?postId=${props.id}`);
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

  React.useEffect(() => {
    if (quotedPostId) {
      // Fetch the quoted post data
      fetch(`/api/post/${quotedPostId}`)
        .then((res) => res.json())
        .then((data) => setQuotedPost(data))
        .catch((err) => console.error("Error fetching quoted post:", err));
    }
  }, [quotedPostId]);

  if (isDeleted) {
    return null;
  }

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
    if (!quotedPostId) {
      return <p className="text-base leading-normal">{parsedContent}</p>;
    }

    const parts = post.content.split(new RegExp(`(\\/post\\/${quotedPostId})`));
    return (
      <>
        {parts.map((part, index) => {
          if (part === `/post/${quotedPostId}`) {
            return quotedPost ? (
              <QuotedTemplate
                key={quotedPostId}
                id={quotedPost.id}
                user={quotedPost.user}
                title={quotedPost.title}
                content={quotedPost.content}
                createdAt={quotedPost.createdAt}
              />
            ) : (
              <p key={index} className="text-gray-500">
                Loading quoted post...
              </p>
            );
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
    <div className="w-[90%] border-lightBorder transition duration-200 hover:border-lightBorderHover dark:border-darkBorder dark:hover:border-darkBorderHover sm:w-[800px] sm:rounded-2xl sm:border sm:p-[15px]">
      <div className="flex flex-col gap-[10px]">
        {/* Only show if post is shared */}
        {isShared && sharedPost && (
          <p className="text-sm text-primaryGray">
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
              {/* {formatDate(post.timestamp)} */}
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
          commentsCount={comments?.length}
          onCommentClick={() =>
            setCommentSectionHeight(commentSectionHeight === 0 ? "auto" : 0)
          }
          sharesCount={sharesCount}
          onShareClick={handleShareClick}
          shareButtonRef={shareButtonRef}
          donationCount={0}
          liked={likesData?.userLiked ?? post.userLiked}
          onLike={handleLikeToggle}
          onUnlike={handleLikeToggle}
        />
      </div>
      {isShareMenuOpen && (
        <div ref={shareMenuRef}>
          <PostShareMenu
            postId={post.id}
            onShare={userHasShared ? handleUnshare : handleShare}
            onQuote={handleQuote}
            userHasShared={userHasShared}
          />
        </div>
      )}
      <AnimateHeight duration={500} height={commentSectionHeight}>
        <div className="mt-2.5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Comments</h2>
            <span className="text-xl font-bold text-primaryGray">·</span>
            <p className="text-xl text-primaryGray">{comments?.length}</p>
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
                className="rounded-full bg-blue-600 px-2 py-1 text-sm font-semibold text-white transition duration-150 ease-in-out hover:bg-hoverBlue"
              >
                Send a comment?
              </Link>
            </div>
            <div className="mt-5 flex w-full flex-col gap-5">
              {comments?.length === 0 ? (
                <p className="text-md text-gray-500">No comments yet...</p>
              ) : (
                comments?.map((comment) => (
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
