import DropdownMenu from "../buttons/DropdownMenu";

interface PostDropdownMenuProps {
  id: string;
}

export default function PostDropdownMenu({ id }: PostDropdownMenuProps) {
  return (
    <div>
      <DropdownMenu
        menuItems={[
          { label: "Open post", href: `/post/${id}` },
          { label: "Bookmark post", href: "#", onClick: () => {} },
          { label: "Report post", href: "#" },
          { label: "Block @username", href: "#" },
          {
            label: "Delete post",
            href: "#",
            className: "text-red-500/50 hover:text-red-500",
          },
        ]}
      />
    </div>
  );
}
