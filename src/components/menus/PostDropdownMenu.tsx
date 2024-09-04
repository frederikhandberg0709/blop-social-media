"use client";

import { useSession } from "next-auth/react";
import DropdownMenu from "../buttons/DropdownMenu";
import { useEffect, useState } from "react";
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
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeletePost = async () => {
    if (!session) return;
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
        console.error("Error deleting post: ", error);
        alert("Failed to delete post. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
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
    </div>
  );
}
