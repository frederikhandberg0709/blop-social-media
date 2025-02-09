"use client";

import { useSession } from "next-auth/react";
import DropdownMenu from "./DropdownMenu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDeletePost } from "@/hooks/api/posts/useDeletePost";
import DeleteConfirmationDialog from "../dialog/DeleteConfirmationDialog";
import { useQueryClient } from "@tanstack/react-query";

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
  onPostDeleted,
}: PostDropdownMenuProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isAuthor = session?.user?.id === authorId;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: deletePost, isPending: isDeletingPost } = useDeletePost();

  // TODO: Replace with hook
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!session) return;
      try {
        const response = await fetch(`/api/bookmarks?postId=${postId}`);
        if (response.ok) {
          const data = await response.json();
          setIsBookmarked(data.isBookmarked);
        }
      } catch (error) {
        console.error("Error checking bookmark status: ", error);
      }
    };

    checkBookmarkStatus();
  }, [postId, session]);

  // TODO: Replace with hook
  const handleSaveBookmark = async () => {
    if (!session) return;
    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
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

  // TODO: Replace with hook
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
      label: isBookmarked ? "Remove bookmark" : "Save bookmark",
      href: "#",
      onClick: isBookmarked ? handleDeleteBookmark : handleSaveBookmark,
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
