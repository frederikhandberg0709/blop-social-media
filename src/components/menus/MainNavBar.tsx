"use client";

import Image from "next/image";
import Link from "next/link";
import NavSideBar from "./NavSideBar";
import { useState } from "react";
import NavProfileMenu from "./NavProfileMenu";

const MainNavBar: React.FC = () => {
  const [navSideMenuOpen, setNavSideMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const toggleNavSideMenu = () => {
    setNavSideMenuOpen(!navSideMenuOpen);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  return (
    <>
      <nav className="fixed z-[99] w-full top-0 left-0 right-0 flex justify-center items-center px-[50px] bg-black">
        <div className="flex justify-between items-center w-full py-[10px]">
          {/* Branding & menu button */}
          <div className="flex items-center gap-[30px]">
            <Link
              href=""
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
          <div>
            <input
              type="text"
              placeholder="Search..."
              className="bg-white bg-opacity-[6%] hover:bg-opacity-10 focus:bg-opacity-10 text-white placeholder:text-white/50 border-2 border-blue-500/10 hover:border-blue-500 focus:border-blue-500 w-[300px] focus:w-[700px] h-[45px] rounded-full px-[15px] placeholder-white outline-none transition-all duration-300 ease-in-out"
            />
          </div>
          {/* Notifications, DMs, & Profile menu */}
          <div className="flex items-center gap-[30px]">
            {/* Notification button */}
            <button className="w-[45px] h-[45px] rounded-full p-[7px] fill-white/50 hover:fill-white active:fill-blue-500 hover:bg-white/10 transition duration-150 ease-in-out">
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
            <button onClick={toggleProfileMenu}>
              <Image
                src=""
                className="rounded-full w-[50px] h-[50px] bg-white"
                alt="Profile picture"
              />
            </button>
          </div>
        </div>
      </nav>
      {navSideMenuOpen && <NavSideBar />}
      {profileMenuOpen && (
        <NavProfileMenu
          profilePicture={""}
          profileName={"Profile name"}
          username={"username"}
        />
      )}
    </>
  );
};

export default MainNavBar;
