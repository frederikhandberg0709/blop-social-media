"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function PostDropdownMenu() {
  const { data: session } = useSession();
  // Post Dropdown Menu open/close functionality
  const [isPostDropdownMenuOpen, setIsPostDropdownMenuOpen] = useState(false);

  let dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setIsPostDropdownMenuOpen(false);
        console.log(dropdownRef.current);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <div ref={dropdownRef}>
      <button
        onClick={() => {
          setIsPostDropdownMenuOpen(!isPostDropdownMenuOpen);
        }}
        className="cursor-pointer rounded-full fill-primaryGray stroke-primaryGray p-[5px] transition ease-in-out hover:bg-lightHover hover:fill-black hover:stroke-black active:bg-lightActive active:fill-primaryBlue active:stroke-primaryBlue dark:hover:bg-darkHover dark:hover:fill-white dark:hover:stroke-white dark:active:bg-darkActive dark:active:fill-primaryBlue dark:active:stroke-primaryBlue"
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 128 128"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M63.9999 21.3333C62.5854 21.3333 61.2289 21.8952 60.2287 22.8953C59.2285 23.8955 58.6666 25.2521 58.6666 26.6666C58.6666 28.0811 59.2285 29.4376 60.2287 30.4378C61.2289 31.438 62.5854 31.9999 63.9999 31.9999C65.4144 31.9999 66.771 31.438 67.7712 30.4378C68.7713 29.4376 69.3333 28.0811 69.3333 26.6666C69.3333 25.2521 68.7713 23.8955 67.7712 22.8954C66.771 21.8952 65.4144 21.3333 63.9999 21.3333ZM63.9999 58.6666C62.5854 58.6666 61.2289 59.2285 60.2287 60.2287C59.2285 61.2289 58.6666 62.5854 58.6666 63.9999C58.6666 65.4144 59.2285 66.771 60.2287 67.7712C61.2289 68.7713 62.5854 69.3333 63.9999 69.3333C65.4144 69.3333 66.771 68.7713 67.7712 67.7712C68.7713 66.771 69.3333 65.4144 69.3333 63.9999C69.3333 62.5854 68.7713 61.2289 67.7712 60.2287C66.771 59.2285 65.4144 58.6666 63.9999 58.6666ZM63.9999 95.9999C62.5854 95.9999 61.2289 96.5618 60.2287 97.562C59.2285 98.5622 58.6666 99.9188 58.6666 101.333C58.6666 102.748 59.2285 104.104 60.2287 105.104C61.2289 106.105 62.5854 106.667 63.9999 106.667C65.4144 106.667 66.771 106.105 67.7712 105.104C68.7713 104.104 69.3332 102.748 69.3332 101.333C69.3332 99.9188 68.7713 98.5622 67.7712 97.562C66.771 96.5618 65.4144 95.9999 63.9999 95.9999Z"
            strokeWidth="15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        className={`absolute z-50 mt-[10px] w-[200px] rounded-xl border border-lightBorder bg-white transition duration-200 ease-in-out hover:border-lightBorderHover dark:border-darkBorder dark:bg-black dark:hover:border-darkBorderHover ${
          isPostDropdownMenuOpen ? "block" : "hidden"
        }`}
      >
        <PostDropdownMenuActive />
      </div>
    </div>
  );
}

function PostDropdownMenuActive() {
  return (
    <div className="flex flex-col">
      <Link
        href="#"
        className="text-primary-gray hover:bg-light-hover active:bg-light-active rounded-t-xl px-[20px] py-[10px] font-medium transition duration-200 ease-in-out hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white dark:active:bg-white/20"
      >
        Open post
      </Link>
      <Link
        href="#"
        className="text-primary-gray hover:bg-light-hover active:bg-light-active px-[20px] py-[10px] font-medium transition duration-200 ease-in-out hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white dark:active:bg-white/20"
      >
        Bookmark post
      </Link>
      <Link
        href="#"
        className="text-primary-gray hover:bg-light-hover active:bg-light-active px-[20px] py-[10px] font-medium transition duration-200 ease-in-out hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white dark:active:bg-white/20"
      >
        Report post
      </Link>
      <Link
        href="#"
        className="text-primary-gray hover:bg-light-hover active:bg-light-active rounded-b-xl px-[20px] py-[10px] font-medium transition duration-200 ease-in-out hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white dark:active:bg-white/20"
      >
        Block @username
      </Link>
      <Link
        href="#"
        className="active:bg-light-active rounded-b-xl px-[20px] py-[10px] font-medium text-red-500/50 transition duration-200 ease-in-out hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-red-500 dark:active:bg-white/20"
      >
        Delete post
      </Link>
    </div>
  );
}
