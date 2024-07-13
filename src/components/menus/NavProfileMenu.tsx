import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavProfileMenuProps {
  profilePicture: string | null;
  profileName: string | null;
  username: string | null;
  closeMenu: () => void;
}

const NavProfileMenu: React.FC<NavProfileMenuProps> = ({
  profilePicture,
  profileName,
  username,
  closeMenu,
}) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const currentPage = pathname;

  const logout = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-col gap-[10px]">
      <Link
        href={`/profile/${username}`}
        onClick={closeMenu}
        className="flex gap-[12px] items-center p-[10px] rounded-xl hover:bg-white/10 active:bg-white/20 transition ease-in-out duration-150 group"
      >
        <img
          src={profilePicture || "/images/default_profile.jpg"}
          alt="Profile picture"
          className="rounded-full w-[40px] h-[40px] object-cover"
        />
        <div className="group">
          <p className="font-bold text-[15px] group-hover:text-blue-500">
            {profileName ?? username}
          </p>
          <p className="text-[14px] text-gray-500">@{username}</p>
        </div>
      </Link>
      <div className="w-full h-[1px] bg-blue-500/10"></div>
      <Link
        href={`/profile/${username}`}
        onClick={closeMenu}
        className={`flex gap-[10px] px-[10px] py-[10px] rounded-xl font-medium hover:bg-white/10 active:bg-white/20  transition ease-in-out duration-150 ${
          (currentPage === `/profile/${session?.user.username}` &&
            "text-white fill-white") ||
          "text-white/50 hover:text-white fill-white/50 hover:fill-white"
        }`}
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0Zm0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5H8Z"
            clip-rule="evenodd"
          />
        </svg>{" "}
        My Profile
      </Link>
      <Link
        href={"/settings"}
        onClick={closeMenu}
        className={`flex gap-[10px] px-[10px] py-[10px] rounded-xl font-medium hover:bg-white/10 active:bg-white/20 transition ease-in-out duration-150 ${
          (currentPage === "/settings" && "text-white fill-white") ||
          "text-white/50 hover:text-white fill-white/50 hover:fill-white"
        }`}
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19.5 12c0-.23-.01-.45-.03-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23a.987.987 0 0 0-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-.99-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41a7.343 7.343 0 0 0 0 1.35l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88.99.88h3.73c.5 0 .93-.38.99-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.03-.23.04-.45.04-.68zm-7.46 3.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5z" />
        </svg>{" "}
        Settings
      </Link>
      <button
        onClick={logout}
        className="flex gap-[10px] px-[10px] py-[10px] rounded-xl font-medium text-white/50 hover:text-white hover:bg-white/10 active:bg-white/20 fill-white/50 hover:fill-white transition ease-in-out duration-150"
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 5h6c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h6c.55 0 1-.45 1-1s-.45-1-1-1H5V5z" />
          <path d="m20.65 11.65l-2.79-2.79a.501.501 0 0 0-.86.35V11h-7c-.55 0-1 .45-1 1s.45 1 1 1h7v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.19.2-.51.01-.7z" />
        </svg>{" "}
        Logout
      </button>
    </div>
  );
};

export default NavProfileMenu;
