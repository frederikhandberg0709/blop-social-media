import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavSideBar: React.FC = () => {
  const pathname = usePathname();
  const currentPage = pathname;

  return (
    <div className="flex flex-col gap-[15px]">
      {/* Main Navlinks */}
      <div className="flex flex-col gap-[5px]">
        <Link
          href={"/home"}
          className={`text-[20px] font-medium hover:bg-white/10 active:bg-white/20 rounded-xl px-[20px] py-[10px] transition duration-150 ease-in-out ${
            (currentPage === "/home" && "text-white") ||
            "text-white/50 hover:text-white"
          }`}
        >
          Home
        </Link>
        <Link
          href={"/discover"}
          className={`text-[20px] font-medium hover:bg-white/10 active:bg-white/20 rounded-xl px-[20px] py-[10px] transition duration-150 ease-in-out ${
            (currentPage === "/discover" && "text-white") ||
            "text-white/50 hover:text-white"
          }`}
        >
          Discover
        </Link>
        <Link
          href={"/following"}
          className={`text-[20px] font-medium hover:bg-white/10 active:bg-white/20 rounded-xl px-[20px] py-[10px] transition duration-150 ease-in-out ${
            (currentPage === "/following" && "text-white") ||
            "text-white/50 hover:text-white"
          }`}
        >
          Following
        </Link>
      </div>
      <div className="w-full h-[1px] bg-white/5"></div>
      {/* Following List */}
      <div>
        <div>
          <h1 className="text-white/50 text-[15px] font-bold px-[20px] pb-[10px]">
            FOLLOWING
          </h1>
          {/* <p className="text-white/50 text-[15px]">{followingCount}</p> */}
        </div>
        <div className="flex flex-col gap-[5px]">
          <Link
            href=""
            className="flex items-center gap-[10px] text-[17px] hover:bg-white/10 rounded-xl px-[20px] py-[10px]"
          >
            <Image
              src=""
              className="bg-white rounded-full h-[30px] w-[30px]"
              alt="Profile picture"
            />
            User 1
          </Link>
          <Link
            href=""
            className="flex items-center gap-[10px] text-[17px] hover:bg-white/10 rounded-xl px-[20px] py-[10px]"
          >
            <Image
              src=""
              className="bg-white rounded-full h-[30px] w-[30px]"
              alt="Profile picture"
            />
            User 2
          </Link>
          <Link
            href=""
            className="flex items-center gap-[10px] text-[17px] hover:bg-white/10 rounded-xl px-[20px] py-[10px]"
          >
            <Image
              src=""
              className="bg-white rounded-full h-[30px] w-[30px]"
              alt="Profile picture"
            />
            User 3
          </Link>
        </div>
      </div>
      <p>{pathname}</p>
    </div>
  );
};

export default NavSideBar;
