"use client";

import { useSession } from "next-auth/react";
import DropdownMenu from "../buttons/DropdownMenu";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CommentDropdownMenuProps {
  commentId: string;
  postId: string;
  authorId: string;
  authorUsername: string;
  onCommentDeleted: () => void;
}

export default function CommentDropdownMenu({
  commentId,
  postId,
  authorId,
  authorUsername,
  onCommentDeleted,
}: CommentDropdownMenuProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const isAuthor = session?.user?.id === authorId;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteComment = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setIsDeleting(true);
      try {
        const response = await fetch(
          `/api/delete-comment?commentId=${commentId}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to delete comment");
        }

        onCommentDeleted();
      } catch (error) {
        console.error("Error deleting comment:", error);
        alert("Failed to delete comment. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const authorOnlyItems = [
    {
      label: "Edit comment",
      href: `/edit-comment/${commentId}?postId=${postId}`,
    },
    {
      label: "Delete comment",
      href: "#",
      className: "text-red-500/50 hover:text-red-500",
      onClick: handleDeleteComment,
    },
  ];

  const nonAuthorOnlyItems = [
    {
      label: "Report comment",
      href: "#",
      onClick: () => {
        /* Add report logic */
      },
    },
    {
      label: `Block @${authorUsername}`,
      href: "#",
      onClick: () => {
        /* Block user logic */
      },
    },
  ];

  const commonItems = [
    {
      label: "Copy link",
      href: "#",
      onClick: () => {
        navigator.clipboard.writeText(
          `${window.location.origin}/post/${postId}#comment-${commentId}`,
        );
        alert("Comment link copied to clipboard!");
      },
    },
  ];

  const menuItems = [
    ...commonItems,
    ...(isAuthor ? authorOnlyItems : nonAuthorOnlyItems),
  ];

  return (
    <div>
      <DropdownMenu menuItems={menuItems} />
    </div>
  );
}
