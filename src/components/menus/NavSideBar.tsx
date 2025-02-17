import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import SideMenuFollowList from "../SideMenuFollowList";
import { useSession } from "next-auth/react";

const NavSideBar: React.FC = () => {
  const pathname = usePathname();
  const currentPage = pathname;
  const { data: session } = useSession();

  const isLoggedIn = session ? true : false;

  return (
    <div className="flex flex-col gap-[15px]">
      {/* Main Navlinks */}
      <div className="flex flex-col gap-[5px]">
        <Link
          href={"/home"}
          className={`rounded-xl px-[20px] py-[10px] text-[20px] font-medium transition duration-150 ease-in-out hover:bg-lightHover active:bg-lightActive dark:hover:bg-darkHover dark:active:bg-darkActive ${
            (currentPage === "/home" && "text-black dark:text-white") ||
            "text-primaryGray hover:text-black dark:hover:text-white"
          }`}
        >
          Home
        </Link>
        <Link
          href={"/discover"}
          className={`rounded-xl px-[20px] py-[10px] text-[20px] font-medium transition duration-150 ease-in-out hover:bg-lightHover active:bg-lightActive dark:hover:bg-darkHover dark:active:bg-darkActive ${
            (currentPage === "/discover" && "text-black dark:text-white") ||
            "text-primaryGray hover:text-black dark:hover:text-white"
          }`}
        >
          Discover
        </Link>
        {(isLoggedIn && (
          <Link
            href={"/following"}
            className={`rounded-xl px-[20px] py-[10px] text-[20px] font-medium transition duration-150 ease-in-out hover:bg-lightHover active:bg-lightActive dark:hover:bg-darkHover dark:active:bg-darkActive ${
              (currentPage === "/following" && "text-black dark:text-white") ||
              "text-primaryGray hover:text-black dark:hover:text-white"
            }`}
          >
            Following
          </Link>
        )) ||
          null}
      </div>
      <div className="h-[1px] w-full bg-lightHover dark:bg-white/5"></div>
      {(isLoggedIn && session?.user?.id && (
        <div className="flex flex-col gap-[15px]">
          {/* Following List */}
          <SideMenuFollowList id={session.user.id} />
          <div className="h-[1px] w-full bg-lightHover dark:bg-white/5"></div>
        </div>
      )) ||
        null}
      <div className="flex flex-wrap gap-x-5 gap-y-1 px-3">
        <Link
          href={"#"}
          className="text-sm text-primaryGray transition duration-150 ease-in-out hover:text-black hover:underline dark:hover:text-white"
        >
          About
        </Link>
        <Link
          href={"#"}
          className="text-sm text-primaryGray transition duration-150 ease-in-out hover:text-black hover:underline dark:hover:text-white"
        >
          Our Mission
        </Link>
        <Link
          href={"#"}
          className="text-sm text-primaryGray transition duration-150 ease-in-out hover:text-black hover:underline dark:hover:text-white"
        >
          Help
        </Link>
        <Link
          href={"#"}
          className="text-sm text-primaryGray transition duration-150 ease-in-out hover:text-black hover:underline dark:hover:text-white"
        >
          Contact
        </Link>
        <Link
          href={"#"}
          className="text-sm text-primaryGray transition duration-150 ease-in-out hover:text-black hover:underline dark:hover:text-white"
        >
          Open-source
        </Link>
      </div>
    </div>
  );
};

export default NavSideBar;
