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
        handleClickOutsideNotificationPanel
      );
    } else {
      document.removeEventListener(
        "mousedown",
        handleClickOutsideNotificationPanel
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
        handleClickOutsideNotificationPanel
      );
      document.removeEventListener("mousedown", handleClickOutsideProfileMenu);
      window.removeEventListener("resize", handleResize);
    };
  }, [isNotificationPanelVisible, isProfileMenuVisible]);

  return (
    <>
      <nav className="fixed z-[99] w-full top-0 left-0 right-0 flex justify-center items-center px-[50px] bg-black">
        <div className="flex justify-between items-center w-full py-[10px]">
          {/* Branding & menu button */}
          <div
            className={`flex items-center gap-[30px] ${
              isLoggedIn ? "w-[200px]" : "w-[264px]"
            }`}
          >
            <Link
              href="/home"
              className="text-white/50 hover:text-white active:text-blue-500 font-bold text-[30px] transition duration-150 ease-in-out"
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
                className="w-[45px] h-[45px] rounded-full p-[5px] fill-white/50 hover:fill-white active:fill-blue-500 hover:bg-white/10 transition duration-150 ease-in-out"
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
            className={`relative cursor-text border-2 w-[300px] h-[45px] rounded-full outline-none transition-all duration-300 ease-in-out ${
              isSearchFocused
                ? "border-blue-500 stroke-white w-[700px] bg-white bg-opacity-10"
                : "border-gray-900 hover:border-gray-800 stroke-gray-500 hover:stroke-white bg-white bg-opacity-[5%] hover:bg-opacity-10"
            }`}
          >
            <div className="absolute flex items-center gap-[10px] w-full h-full pl-[15px]">
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
                className="w-full h-full bg-transparent outline-none placeholder-gray-500"
              />
            </div>
          </div>
          {!isLoggedIn && (
            <div className="flex items-center gap-[30px]">
              <Link
                href={"/login"}
                className="font-semibold text-white border-[3px] border-blue-500 hover:border-blue-700 hover:bg-blue-700 px-4 py-2 rounded-xl transition-all duration-150 ease-in-out"
              >
                Login
              </Link>
              <Link
                href={"/create-account"}
                className="font-semibold text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-xl transition-all duration-150 ease-in-out"
              >
                Create Account
              </Link>
            </div>
          )}
          {isLoggedIn && (
            /* Create Post, Notifications, DMs, & Profile menu */
            <div className="flex items-center justify-end gap-[30px] w-[200px]">
              {/* Create Post */}
              <Tooltip text={"Create Post"} position="bottom" offset="60">
                <Link href={"/create-post"} className="rounded-full">
                  <div className="h-[45px] w-[45px] p-[7px] rounded-full fill-white/50 hover:fill-white active:fill-blue-500 hover:bg-white/10 transition duration-150 ease-in-out">
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
                  className="w-[45px] h-[45px] rounded-full p-[7px] fill-white/50 hover:fill-white line active:fill-blue-500 hover:bg-white/10 transition duration-150 ease-in-out"
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
                  className="rounded-full w-[50px] h-[50px] bg-white"
                  alt="Profile picture"
                />
              </button>
            </div>
          )}
        </div>
      </nav>
      {isNavSideMenuVisible && (
        <div
          className={`fixed z-50 top-[90px] left-[20px] w-[250px] flex flex-col p-[10px] rounded-2xl bg-black border-2 border-gray-900 hover:border-gray-800 transition duration-150 ease-in-out ${
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
          className={`fixed left-1/2 ml-[-350px] top-[80px] h-[500px] w-[700px] bg-black/80 border-2 border-gray-900 backdrop-blur-2xl z-50 rounded-[15px]`}
        >
          <NavSearchResults />
        </div>
      )}
      {isNotificationPanelVisible && (
        <div
          ref={notificationPanelRef}
          className={`fixed top-[90px] z-50 right-[20px] rounded-[10px] p-[10px] w-[350px] bg-black border-2 border-gray-900 hover:border-gray-800 transition ease-in-out duration-150 ${
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
          className={`fixed z-50 top-[90px] right-[20px] rounded-[10px] p-[10px] w-[280px] bg-black border-2 border-gray-900 hover:border-gray-800 transition ease-in-out duration-150 ${
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
