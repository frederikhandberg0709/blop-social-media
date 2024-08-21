"use client";

import { useSession } from "next-auth/react";
import PostActionButtons from "../buttons/PostActionButtons";
import { useEffect, useState } from "react";
import { PostProps } from "@/types/PostProps";
import { formatDate } from "@/utils/formattedDate";
import PostDropdownMenu from "../menus/PostDropdownMenu";
import Link from "next/link";
import { parseTextWithEnhancements } from "@/utils/parseTextWithEnhancements";
import CommentTemplate from "../CommentTemplate";

interface PostCommentPreviewProps {
  post: PostProps;
}

export default function PostCommentPreview({ post }: PostCommentPreviewProps) {
  const { data: session } = useSession();
  const [likesCount, setLikesCount] = useState(post.initialLikesCount);
  const [liked, setLiked] = useState(post.userLiked);
  const [comments, setComments] = useState<any[]>([]);
  const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);
  const [commentTitle, setCommentTitle] = useState<string>("");
  const [commentContent, setCommentContent] = useState<string>("");

  useEffect(() => {
    const fetchLikesCount = async () => {
      try {
        const userId = session?.user?.id;
        const response = await fetch(
          `/api/likes-count-post?postId=${post.id}&userId=${userId}`,
        );
        const data = await response.json();
        setLikesCount(data.likesCount);
        setLiked(data.userLiked);
      } catch (error) {
        console.error("Error fetching likes count:", error);
      }
    };

    fetchLikesCount();
  }, [post.id]);

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

  const handleLike = async () => {
    // Function should be disabled
  };

  const handleUnlike = async () => {
    // Function should be disabled
  };

  const defaultProfilePicture =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg5CvxCysqjZrsTPUjcl5sN3HIzePiCWM7KQ&s";

  const parsedContent =
    typeof post.content === "string"
      ? parseTextWithEnhancements(post.content)
      : post.content;

  if (!post.user) {
    return null; // Loading indicator or placeholder
  }

  return (
    <div className="flex w-[90%] flex-col gap-[10px] border-lightBorder transition duration-200 hover:border-lightBorderHover dark:border-darkBorder dark:hover:border-darkBorderHover sm:w-[800px] sm:rounded-[15px] sm:border sm:p-[15px]">
      <div className="flex items-center justify-between">
        <Link
          href={`/profile/${post.user.username}`}
          className="group flex items-center gap-[10px]"
        >
          <img
            src={post.user.profilePicture || defaultProfilePicture}
            alt={`${post.user.profileName}'s profile picture`}
            className="h-[40px] w-[40px] rounded-full object-cover"
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
            {formatDate(post.timestamp)}
            {/* Fix the date */}
          </div>
          {/* Dropdown menu */}
          <PostDropdownMenu id={post.id} />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {post.title && <h1 className="text-xl font-bold">{post.title}</h1>}
        <p className="text-base leading-normal">{parsedContent}</p>
      </div>
      <PostActionButtons
        likesCount={likesCount}
        commentsCount={comments.length}
        onCommentClick={() =>
          setIsCommentSectionVisible(!isCommentSectionVisible)
        }
        sharesCount={0}
        donationCount={0}
        liked={liked}
        onLike={handleLike}
        onUnlike={handleUnlike}
      />
      <CommentTemplate
        id={session?.user.id || ""}
        user={session?.user}
        createdAt={formatDate(new Date().toISOString())}
        updatedAt={formatDate(new Date().toISOString())}
        timestamp={new Date().toISOString()}
        title={commentTitle}
        content={parseTextWithEnhancements(commentContent)}
        initialLikesCount={0}
        userLiked={false}
      />
    </div>
  );
}
