"use client";

import Link from "next/link";
import NavSideBar from "./NavSideBar";
import { useEffect, useRef, useState } from "react";
import NavProfileMenu from "./NavProfileMenu";
import NotificationPanel from "../NotificationPanel";
import "./panel-animations.css";
import NavSearchResults from "./NavSearchResults";
import { Tooltip } from "../Tooltip";
import { useSession } from "next-auth/react";

const MainNavBar: React.FC = () => {
  const [isNavSideMenuVisible, setIsNavSideMenuVisible] = useState(false);
  const [isNavSideMenuAnimating, setIsNavSideMenuAnimating] = useState(false);
  const [isNotificationPanelVisible, setIsNotificationPanelVisible] =
    useState(false);
  const [isNotificationPanelAnimating, setIsNotificationPanelAnimating] =
    useState(false);
  const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false);
  const [isProfileMenuAnimating, setIsProfileMenuAnimating] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  // const searchInputRef = useRef<HTMLInputElement>(null);
  const notificationPanelRef = useRef<HTMLDivElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const { data: session, status } = useSession();

  const isLoggedIn = session ? true : false;

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const toggleNavSideMenu = () => {
    if (isNavSideMenuVisible) {
      setIsNavSideMenuAnimating(false);
      setTimeout(() => setIsNavSideMenuVisible(false), 300);
    } else {
      setIsNavSideMenuVisible(true);
      setTimeout(() => setIsNavSideMenuAnimating(true), 10);
    }
  };

  const handleResize = () => {
    if (window.innerWidth > 1140) {
      setIsNavSideMenuVisible(true);
      setTimeout(() => setIsNavSideMenuAnimating(true), 10);
    } else {
      setIsNavSideMenuAnimating(false);
      setTimeout(() => setIsNavSideMenuVisible(false), 300);
    }
  };

  const handleSearchFocusInput = () => {
    // searchInputRef.current?.focus();
    searchContainerRef.current?.querySelector("input")?.focus();
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = (event: React.FocusEvent) => {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.relatedTarget as Node)
    ) {
      setIsSearchFocused(false);
    }
  };

  const toggleIsSearching = () => {};

  const toggleNotificationPanel = () => {
    if (isNotificationPanelVisible) {
      setIsNotificationPanelAnimating(false);
      setTimeout(() => setIsNotificationPanelVisible(false), 300);
    } else {
      setIsNotificationPanelVisible(true);
      setTimeout(() => setIsNotificationPanelAnimating(true), 10);
    }
  };

  const toggleProfileMenu = () => {
    if (isProfileMenuVisible) {
      setIsProfileMenuAnimating(false);
      setTimeout(() => setIsProfileMenuVisible(false), 300);
    } else {
      setIsProfileMenuVisible(true);
      setTimeout(() => setIsProfileMenuAnimating(true), 10);
    }
  };

  const closeNotificationPanel = () => {
    setIsNotificationPanelAnimating(false);
    setTimeout(() => setIsNotificationPanelVisible(false), 300);
  };

  const closeProfileMenu = () => {
    setIsProfileMenuAnimating(false);
    setTimeout(() => setIsProfileMenuVisible(false), 300);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    const handleClickOutsideNotificationPanel = (event: MouseEvent) => {
      if (
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(event.target as Node) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(event.target as Node)
      ) {
        closeNotificationPanel();
      }
    };

    const handleClickOutsideProfileMenu = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        profileMenuButtonRef.current &&
        !profileMenuButtonRef.current.contains(event.target as Node)
      ) {
        closeProfileMenu();
      }
    };

    if (isNotificationPanelVisible) {
      document.addEventListener(
        "mousedown",
        handleClickOutsideNotificationPanel,
      );
    } else {
      document.removeEventListener(
        "mousedown",
        handleClickOutsideNotificationPanel,
      );
    }

    if (isProfileMenuVisible) {
      document.addEventListener("mousedown", handleClickOutsideProfileMenu);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideProfileMenu);
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutsideNotificationPanel,
      );
      document.removeEventListener("mousedown", handleClickOutsideProfileMenu);
      window.removeEventListener("resize", handleResize);
    };
  }, [isNotificationPanelVisible, isProfileMenuVisible]);

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-[99] flex w-full items-center justify-center bg-white px-[50px] dark:bg-black">
        <div className="flex w-full items-center justify-between py-[10px]">
          {/* Branding & menu button */}
          <div
            className={`flex items-center gap-[30px] ${
              isLoggedIn ? "w-[200px]" : "w-[264px]"
            }`}
          >
            <Link
              href="/home"
              className="text-[30px] font-bold text-black/50 transition duration-150 ease-in-out hover:text-black active:text-blue-500 dark:text-white/50 dark:hover:text-white"
            >
              BLOP!
            </Link>
            {/* Show/hide button for Sidebar Menu */}
            <Tooltip
              text={isNavSideMenuVisible ? "Close Menu" : "Menu"}
              position="bottom"
              offset="60"
            >
              <button
                onClick={toggleNavSideMenu}
                className="h-[45px] w-[45px] rounded-full fill-black/50 p-[5px] transition duration-150 ease-in-out hover:bg-black/10 hover:fill-black active:fill-blue-500 dark:fill-white/50 dark:hover:bg-white/10 dark:hover:fill-white"
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z" />
                </svg>
              </button>
            </Tooltip>
          </div>
          {/* Search */}
          <div
            onClick={handleSearchFocusInput}
            ref={searchContainerRef}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            tabIndex={-1}
            className={`relative h-[45px] w-[300px] cursor-text rounded-full border-2 outline-none transition-all duration-300 ease-in-out ${
              isSearchFocused
                ? "w-[700px] border-blue-500 bg-white bg-opacity-10 stroke-black dark:stroke-white"
                : "bg-white stroke-gray-500 hover:border-gray-800 hover:bg-opacity-10 hover:stroke-black dark:border-gray-900 dark:bg-opacity-[5%] dark:hover:stroke-white"
            }`}
          >
            <div className="absolute flex h-full w-full items-center gap-[10px] pl-[15px]">
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-2"
              >
                <path
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314Z"
                />
              </svg>
              <input
                // ref={searchInputRef}
                // onFocus={handleSearchFocus}
                // onBlur={handleSearchBlur}
                type="text"
                placeholder="Search..."
                className="h-full w-full bg-transparent placeholder-gray-500 outline-none"
              />
            </div>
          </div>
          {!isLoggedIn && (
            <div className="flex items-center gap-[30px]">
              <Link
                href={"/login"}
                className="rounded-xl border-[3px] border-blue-500 px-4 py-2 font-semibold text-black transition-all duration-150 ease-in-out hover:border-blue-700 hover:bg-blue-700 hover:text-white dark:text-white"
              >
                Login
              </Link>
              <Link
                href={"/create-account"}
                className="rounded-xl bg-blue-500 px-4 py-2 font-semibold text-white transition-all duration-150 ease-in-out hover:bg-blue-700"
              >
                Create Account
              </Link>
            </div>
          )}
          {isLoggedIn && (
            /* Create Post, Notifications, DMs, & Profile menu */
            <div className="flex w-[200px] items-center justify-end gap-[30px]">
              {/* Create Post */}
              <Tooltip text={"Create Post"} position="bottom" offset="60">
                <Link href={"/create-post"} className="rounded-full">
                  <div className="darkhover:fill-white h-[45px] w-[45px] rounded-full fill-black/50 p-[7px] transition duration-150 ease-in-out hover:bg-black/10 hover:fill-black active:fill-blue-500 dark:fill-white/50 dark:hover:bg-white/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className=""
                    >
                      <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1z" />
                    </svg>
                  </div>
                </Link>
              </Tooltip>
              {/* Notification button */}
              <Tooltip
                text={
                  isNotificationPanelVisible
                    ? "Close Notifications"
                    : "Notifications"
                }
                position="bottom"
                offset="60"
              >
                <button
                  onClick={toggleNotificationPanel}
                  ref={notificationButtonRef}
                  className="line darkhover:fill-white h-[45px] w-[45px] rounded-full fill-black/50 p-[7px] transition duration-150 ease-in-out hover:bg-black/10 hover:fill-black active:fill-blue-500 dark:fill-white/50 dark:hover:bg-white/10"
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
              </Tooltip>
              {/* Profile menu button */}
              <button onClick={toggleProfileMenu} ref={profileMenuButtonRef}>
                <img
                  src={session?.user.profilePicture}
                  className="h-[50px] w-[50px] rounded-full bg-white"
                  alt="Profile picture"
                />
              </button>
            </div>
          )}
        </div>
      </nav>
      {isNavSideMenuVisible && (
        <div
          className={`fixed left-[20px] top-[90px] z-50 flex w-[250px] flex-col rounded-2xl border-2 border-gray-200 bg-white p-[10px] transition duration-150 ease-in-out hover:border-gray-300 dark:border-gray-900 dark:bg-black dark:hover:border-gray-800 ${
            isNavSideMenuAnimating ? "navsidemenu-open" : "navsidemenu"
          }`}
        >
          <NavSideBar />
        </div>
      )}
      {/* Search Results */}
      {isSearchFocused && (
        <div
          onClick={handleSearchFocusInput}
          ref={searchContainerRef}
          // onFocus={handleSearchFocus}
          // onBlur={handleSearchBlur}
          tabIndex={-1}
          className={`fixed left-1/2 top-[80px] z-50 ml-[-350px] h-[500px] w-[700px] rounded-[15px] border-2 border-gray-900 bg-black/80 backdrop-blur-2xl`}
        >
          <NavSearchResults />
        </div>
      )}
      {isNotificationPanelVisible && (
        <div
          ref={notificationPanelRef}
          className={`fixed right-[20px] top-[90px] z-50 w-[350px] rounded-[10px] border-2 border-gray-900 bg-black p-[10px] transition duration-150 ease-in-out hover:border-gray-800 ${
            isNotificationPanelAnimating
              ? "notification-panel-open"
              : "notification-panel"
          }`}
        >
          <NotificationPanel />
        </div>
      )}
      {isProfileMenuVisible && (
        <div
          ref={profileMenuRef}
          className={`fixed right-[20px] top-[90px] z-50 w-[280px] rounded-[10px] border-2 border-gray-200 bg-white p-[10px] transition duration-150 ease-in-out hover:border-gray-300 dark:border-gray-900 dark:bg-black dark:hover:border-gray-800 ${
            isProfileMenuAnimating ? "profile-menu-open" : "profile-menu"
          }`}
        >
          <NavProfileMenu
            profilePicture={session?.user.profilePicture || null}
            profileName={session?.user.profileName || null}
            username={session?.user.username || null}
            closeMenu={closeProfileMenu}
          />
        </div>
      )}
    </>
  );
};

export default MainNavBar;
