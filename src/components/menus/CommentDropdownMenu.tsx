import DropdownMenu from "../buttons/DropdownMenu";

export default function CommentDropdownMenu() {
  return (
    <div>
      <DropdownMenu
        menuItems={[
          { label: "Bookmark comment", href: "#", onClick: () => {} },
          { label: "Report comment", href: "#" },
          { label: "Block @username", href: "#" },
          {
            label: "Delete comment",
            href: "#",
            className: "text-red-500/50 hover:text-red-500",
          },
        ]}
      />
    </div>
  );
}
