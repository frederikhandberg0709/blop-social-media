"use client";

import { useSession } from "next-auth/react";
import DropdownMenu from "../buttons/DropdownMenu";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const isAuthor = session?.user?.id === authorId;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setIsDeleting(true);
      try {
        const response = await fetch(`/api/delete-post?postId=${postId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete post");
        }

        onPostDeleted();
        router.push("/");
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const authorOnlyItems = [
    { label: "Edit post", href: `/edit-post/${postId}` },
    {
      label: "Delete post",
      href: "#",
      className: "text-red-500/50 hover:text-red-500",
      onClick: handleDeletePost,
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

  const commonItems = [
    { label: "Open post", href: `/post/${postId}` },
    {
      label: "Bookmark post",
      href: "#",
      onClick: () => {
        /* Bookmark logic */
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
