"use client";

import { useSession } from "next-auth/react";
import DropdownMenu from "./DropdownMenu";
import { useState } from "react";
import { useDeleteComment } from "@/hooks/api/comments/useDeleteComment";
import { useQueryClient } from "@tanstack/react-query";
import DeleteConfirmationDialog from "../dialog/DeleteConfirmationDialog";
import { useBookmarkStatus } from "@/hooks/api/bookmarks/useBookmarkStatus";
import { useCreateBookmark } from "@/hooks/api/bookmarks/useCreateBookmark";
import { useDeleteBookmark } from "@/hooks/api/bookmarks/useDeleteBookmark";

interface CommentDropdownMenuProps {
  commentId: string;
  postId?: string;
  authorId: string;
  authorUsername: string;
}

export default function CommentDropdownMenu({
  commentId,
  postId,
  authorId,
  authorUsername,
}: CommentDropdownMenuProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const isAuthor = session?.user?.id === authorId;
  const { data: bookmarkStatus, isPending: isBookmarkStatusPending } =
    useBookmarkStatus({ type: "comment", id: commentId });
  const { mutate: createBookmark, isPending: isCreatingBookmark } =
    useCreateBookmark();
  const { mutate: deleteBookmark, isPending: isDeletingBookmark } =
    useDeleteBookmark();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: deleteComment, isPending: isDeletingComment } =
    useDeleteComment();

  const handleSaveBookmark = () => {
    createBookmark(
      { type: "comment", id: commentId },
      {
        onSuccess: () => {
          console.log("Bookmark created");
        },
      },
    );
  };

  const handleDeleteBookmark = () => {
    if (!bookmarkStatus?.bookmarkId) return;

    deleteBookmark({
      bookmarkId: bookmarkStatus.bookmarkId,
      type: "comment",
      id: commentId,
    });
  };

  const handleDeleteComment = () => {
    deleteComment(
      { commentId },
      {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        },
      },
    );
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
      label: isBookmarkStatusPending
        ? "Loading..."
        : bookmarkStatus?.isBookmarked
          ? "Remove bookmark"
          : "Save bookmark",
      href: "#",
      onClick: bookmarkStatus?.isBookmarked
        ? handleDeleteBookmark
        : handleSaveBookmark,
      disabled: isCreatingBookmark || isDeletingBookmark,
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
      onClick: () => setIsDeleteDialogOpen(true),
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

      <DeleteConfirmationDialog
        title="Delete Comment"
        text="Are you sure you want to delete this comment? This action cannot be undone."
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteComment}
        isLoading={isDeletingComment}
      />
    </div>
  );
}
