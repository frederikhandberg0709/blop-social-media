"use client";

import { useSession } from "next-auth/react";
import DropdownMenu from "../buttons/DropdownMenu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!session) return;
      try {
        const response = await fetch(`/api/bookmarks?commentId=${commentId}`);
        if (response.ok) {
          const data = await response.json();
          setIsBookmarked(data.isBookmarked);
        }
      } catch (error) {
        console.error("Error checking bookmark status: ", error);
      }
    };

    checkBookmarkStatus();
  }, [commentId, session]);

  const handleSaveBookmark = async () => {
    if (!session) return;
    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId }),
      });

      if (!response.ok) {
        throw new Error("Failed to save bookmark");
      }

      setIsBookmarked(true);
      alert("Post saved to bookmarks");
    } catch (error) {
      console.log("Error saving bookmark: ", error);
    }
  };

  const handleDeleteBookmark = async () => {
    if (!session) return;
    try {
      const response = await fetch("/api/bookmarks", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete bookmark");
      }

      setIsBookmarked(false);
      alert("Bookmark removed");
    } catch (error) {
      console.log("Error deleting bookmark: ", error);
    }
  };

  const handleDeleteComment = async () => {
    if (!session) return;
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

  const loggedInItems = [
    {
      label: isBookmarked ? "Remove bookmark" : "Save bookmark",
      href: "#",
      onClick: isBookmarked ? handleDeleteBookmark : handleSaveBookmark,
    },
  ];

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

  let menuItems;
  if (!session) {
    menuItems = [
      ...commonItems,
      {
        label: "Report comment",
        href: "#",
        onClick: () => {
          /* Add report logic */
        },
      },
    ];
  } else if (isAuthor) {
    menuItems = [...commonItems, ...loggedInItems, ...authorOnlyItems];
  } else {
    menuItems = [...commonItems, ...loggedInItems, ...nonAuthorOnlyItems];
  }

  return (
    <div>
      <DropdownMenu menuItems={menuItems} />
    </div>
  );
}
