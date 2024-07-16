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
          className={`rounded-xl px-[20px] py-[10px] text-[20px] font-medium transition duration-150 ease-in-out hover:bg-black/10 active:bg-black/20 dark:hover:bg-white/10 dark:active:bg-white/20 ${
            (currentPage === "/home" && "text-black dark:text-white") ||
            "text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
          }`}
        >
          Home
        </Link>
        <Link
          href={"/discover"}
          className={`rounded-xl px-[20px] py-[10px] text-[20px] font-medium transition duration-150 ease-in-out hover:bg-black/10 active:bg-black/20 dark:hover:bg-white/10 dark:active:bg-white/20 ${
            (currentPage === "/discover" && "text-black dark:text-white") ||
            "text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
          }`}
        >
          Discover
        </Link>
        <Link
          href={"/following"}
          className={`rounded-xl px-[20px] py-[10px] text-[20px] font-medium transition duration-150 ease-in-out hover:bg-black/10 active:bg-black/20 dark:hover:bg-white/10 dark:active:bg-white/20 ${
            (currentPage === "/following" && "text-black dark:text-white") ||
            "text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
          }`}
        >
          Following
        </Link>
      </div>
      <div className="h-[1px] w-full bg-black/10 dark:bg-white/5"></div>
      {(isLoggedIn && (
        /* Following List */
        <SideMenuFollowList />
      )) ||
        null}
      <div className="flex flex-wrap gap-x-5 px-3">
        <Link
          href={"#"}
          className="text-sm opacity-50 transition duration-150 ease-in-out hover:underline hover:opacity-100"
        >
          About
        </Link>
        <Link
          href={"#"}
          className="text-sm opacity-50 transition duration-150 ease-in-out hover:underline hover:opacity-100"
        >
          Our Mission
        </Link>
        <Link
          href={"#"}
          className="text-sm opacity-50 transition duration-150 ease-in-out hover:underline hover:opacity-100"
        >
          Help
        </Link>
        <Link
          href={"#"}
          className="text-sm opacity-50 transition duration-150 ease-in-out hover:underline hover:opacity-100"
        >
          Contact
        </Link>
        <Link
          href={"#"}
          className="text-sm opacity-50 transition duration-150 ease-in-out hover:underline hover:opacity-100"
        >
          Open-source
        </Link>
      </div>
      <p>{pathname}</p>
    </div>
  );
};

export default NavSideBar;
