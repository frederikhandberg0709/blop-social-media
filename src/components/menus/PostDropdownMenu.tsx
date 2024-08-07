import { useSession } from "next-auth/react";
import DropdownMenu from "../buttons/DropdownMenu";

interface PostDropdownMenuProps {
  // id: string;
  postId: string;
  authorId: string;
  authorUsername: string;
}

export default function PostDropdownMenu({
  postId,
  authorId,
  authorUsername,
}: PostDropdownMenuProps) {
  const { data: session } = useSession();
  const isAuthor = session?.user?.id === authorId;

  const authorOnlyItems = [
    { label: "Edit post", href: `/edit-post/${postId}` },
    {
      label: "Delete post",
      href: "#",
      className: "text-red-500/50 hover:text-red-500",
      onClick: () => {
        /* Delete post logic */
      },
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
