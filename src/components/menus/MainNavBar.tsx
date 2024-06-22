"use client";

import Image from "next/image";
import Link from "next/link";
import NavSideBar from "./NavSideBar";
import { useEffect, useRef, useState } from "react";
import NavProfileMenu from "./NavProfileMenu";
import NotificationPanel from "../NotificationPanel";

const MainNavBar: React.FC = () => {
  const [isNavSideMenuOpen, setIsNavSideMenuOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const toggleNavSideMenu = () => {
    setIsNavSideMenuOpen(!isNavSideMenuOpen);
  };

  const handleSearchFocusInput = () => {
    searchInputRef.current?.focus();
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const toggleNotificationPanel = () => {
    setIsNotificationPanelOpen(!isNotificationPanelOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const closeProfileMenu = () => {
    setIsProfileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        profileMenuButtonRef.current &&
        !profileMenuButtonRef.current.contains(event.target as Node)
      ) {
        closeProfileMenu();
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  return (
    <>
      <nav className="fixed z-[99] w-full top-0 left-0 right-0 flex justify-center items-center px-[50px] bg-black">
        <div className="flex justify-between items-center w-full py-[10px]">
          {/* Branding & menu button */}
          <div className="flex items-center gap-[30px]">
            <Link
              href="/home"
              className="text-white/50 hover:text-white active:text-blue-500 font-bold text-[30px] transition duration-150 ease-in-out"
            >
              BLOP!
            </Link>
            {/* Show/hide button for Sidebar Menu */}
            <button
              onClick={toggleNavSideMenu}
              className="w-[45px] h-[45px] rounded-full p-[5px] fill-white/50 hover:fill-white active:fill-blue-500 hover:bg-white/10 transition duration-150 ease-in-out"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z" />
              </svg>
            </button>
          </div>
          {/* Search */}
          <div
            onClick={handleSearchFocusInput}
            className={`relative cursor-text border-2 w-[300px] h-[45px] rounded-full outline-none transition-all duration-300 ease-in-out ${
              isSearchFocused
                ? "border-blue-500 stroke-white w-[700px] bg-white bg-opacity-10"
                : "border-blue-500/10 hover:border-blue-500 stroke-gray-500 hover:stroke-white bg-white bg-opacity-[6%] hover:bg-opacity-10"
            }`}
          >
            <div className="absolute flex items-center gap-[10px] w-full h-full pl-[15px]">
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314Z"
                />
              </svg>
              <input
                ref={searchInputRef}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                type="text"
                placeholder="Search..."
                className="w-full h-full bg-transparent outline-none placeholder-gray-500"
              />
            </div>
          </div>
          {/* Notifications, DMs, & Profile menu */}
          <div className="flex items-center gap-[30px]">
            {/* Notification button */}
            <button
              onClick={toggleNotificationPanel}
              className="w-[45px] h-[45px] rounded-full p-[7px] fill-white/50 hover:fill-white active:fill-blue-500 hover:bg-white/10 transition duration-150 ease-in-out"
            >
              <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m32.85 28.13l-.34-.3A14.37 14.37 0 0 1 30 24.9a12.63 12.63 0 0 1-1.35-4.81v-4.94A10.81 10.81 0 0 0 19.21 4.4V3.11a1.33 1.33 0 1 0-2.67 0v1.31a10.81 10.81 0 0 0-9.33 10.73v4.94a12.63 12.63 0 0 1-1.35 4.81a14.4 14.4 0 0 1-2.47 2.93l-.34.3v2.82h29.8Z"
                  className="clr-i-solid clr-i-solid-path-1"
                />
                <path
                  d="M15.32 32a2.65 2.65 0 0 0 5.25 0Z"
                  className="clr-i-solid clr-i-solid-path-2"
                />
                <path fill="none" d="M0 0h36v36H0z" />
              </svg>
            </button>
            {/* Profile menu button */}
            <button onClick={toggleProfileMenu} ref={profileMenuButtonRef}>
              <Image
                src=""
                className="rounded-full w-[50px] h-[50px] bg-white"
                alt="Profile picture"
              />
            </button>
          </div>
        </div>
      </nav>
      {isNavSideMenuOpen && <NavSideBar />}
      {isNotificationPanelOpen && <NotificationPanel />}
      {isProfileMenuOpen && (
        <div ref={profileMenuRef}>
          <NavProfileMenu
            profilePicture={""}
            profileName={"Profile name"}
            username={"username"}
            closeMenu={closeProfileMenu}
          />
        </div>
      )}
    </>
  );
};

export default MainNavBar;
