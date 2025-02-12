"use client";

import { useSession } from "next-auth/react";
import DropdownMenu from "./DropdownMenu";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDeletePost } from "@/hooks/api/posts/useDeletePost";
import DeleteConfirmationDialog from "../dialog/DeleteConfirmationDialog";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateBookmark } from "@/hooks/api/bookmarks/useCreateBookmark";
import { useDeleteBookmark } from "@/hooks/api/bookmarks/useDeleteBookmark";
import { useBookmarkStatus } from "@/hooks/api/bookmarks/useBookmarkStatus";

interface PostDropdownMenuProps {
  postId: string;
  authorId: string;
  authorUsername: string;
  onPostDeleted: () => void;
}

export default function PostDropdownMenu({
  postId,
  authorId,
  authorUsername,
}: PostDropdownMenuProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const isAuthor = session?.user?.id === authorId;
  const { data: bookmarkStatus, isPending: isBookmarkStatusPending } =
    useBookmarkStatus({
      type: "post",
      id: postId,
    });
  const { mutate: createBookmark, isPending: isCreatingBookmark } =
    useCreateBookmark();
  const { mutate: deleteBookmark, isPending: isDeletingBookmark } =
    useDeleteBookmark();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: deletePost, isPending: isDeletingPost } = useDeletePost();

  const handleSaveBookmark = () => {
    createBookmark({ id: postId, type: "post" });
  };

  const handleDeleteBookmark = () => {
    if (!bookmarkStatus?.bookmarkId) {
      console.error("No bookmark ID found");
      return;
    }

    deleteBookmark({
      bookmarkId: bookmarkStatus.bookmarkId,
      id: postId,
      type: "post",
    });
  };

  const handleDeletePost = () => {
    deletePost(
      { postId },
      {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          // TODO: Implement user timeline hook (for UserProfile) before below will work:
          queryClient.invalidateQueries({ queryKey: ["timeline"] });
        },
      },
    );
  };

  const commonItems = [{ label: "Open post", href: `/post/${postId}` }];

  const loggedInItems = [
    {
      label: bookmarkStatus?.isBookmarked ? "Remove bookmark" : "Save bookmark",
      href: "#",
      onClick: isBookmarkStatusPending
        ? "Loading..."
        : bookmarkStatus?.isBookmarked
          ? handleDeleteBookmark
          : handleSaveBookmark,
      disabled: isCreatingBookmark || isDeletingBookmark,
    },
  ];

  const authorOnlyItems = [
    { label: "Edit post", href: `/edit-post/${postId}` },
    {
      label: "Delete post",
      href: "#",
      className: "text-red-500/50 hover:text-red-500",
      onClick: () => setIsDeleteDialogOpen(true),
    },
  ];

  const nonAuthorOnlyItems = [
    {
      label: "Report post",
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
        label: "Report post",
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
        title="Delete Post"
        text="Are you sure you want to delete this post? This action cannot be undone."
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeletePost}
        isLoading={isDeletingPost}
      />
    </div>
  );
}
