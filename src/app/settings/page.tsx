"use client";

import Link from "next/link";
import EditProfile from "./(settings-sections)/EditProfile";
import Notifications from "./(settings-sections)/Notifications";
import Appearance from "./(settings-sections)/Appearance";
import ContentModeration from "./(settings-sections)/ContentModeration";
import VideoPlayer from "./(settings-sections)/VideoPlayer";
import ChangeEmail from "./(settings-sections)/ChangeEmail";
import PasswordSecurity from "./(settings-sections)/PasswordSecurity";
import DeleteAccount from "./(settings-sections)/DeleteAccount";
import useSection from "@/hooks/useSection";

const Settings: React.FC = () => {
  const sections = [
    "edit-profile",
    "notifications",
    "appearance",
    "content-moderation",
    "video-player",
    "change-email",
    "password-security",
    "delete-account",
  ];

  const { activeSection, hoveredSection } = useSection(sections);

  return (
    <>
      <div className="flex justify-center w-full">
        <div className="flex justify-center gap-[30px] h-full w-[1200px]">
          <div className="flex gap-[30px] sticky top-0 pt-[90px] h-[100vh]">
            <div className="w-[250px]">
              <div className="ml-[15px] mb-[20px] flex justify-between items-center">
                <p className="font-bold text-[20px]">Settings</p>
                {/* Search */}
                {/* <TooltipBottom text="Search" topStyle="top-[45px]">
        <div className="p-[5px] border border-1 border-[#1D1D1D] bg-[#0C0C0C] rounded-md cursor-pointer hover:border-selectedPurple hover:bg-darkPurple/30 transition ease-in-out duration-200">
          <svg
            width="25"
            height="25"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#878787"
              d="M456.69 421.39L362.6 327.3a173.81 173.81 0 0 0 34.84-104.58C397.44 126.38 319.06 48 222.72 48S48 126.38 48 222.72s78.38 174.72 174.72 174.72A173.81 173.81 0 0 0 327.3 362.6l94.09 94.09a25 25 0 0 0 35.3-35.3ZM97.92 222.72a124.8 124.8 0 1 1 124.8 124.8a124.95 124.95 0 0 1-124.8-124.8Z"
            />
          </svg>
        </div>
      </TooltipBottom> */}
              </div>
              <div className="flex flex-col">
                {sections.map((section) => (
                  <Link
                    key={section}
                    href={`#${section}`}
                    className={`pl-[15px] py-[10px] rounded-xl ${
                      // activeSection === section ? "text-white" : "text-white/50"
                      hoveredSection === section ||
                      (!hoveredSection && activeSection === section)
                        ? "text-white"
                        : "text-white/50"
                    } hover:text-white hover:bg-white/10 active:bg-white/20 transition duration-150 ease-in-out`}
                  >
                    {section
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Link>
                ))}
              </div>
            </div>
            <div className="h-full w-[1.5px] bg-white/10 absolute right-0"></div>
          </div>
          <div className="w-full mt-[90px]">
            <div
              id="edit-profile"
              className={`${
                hoveredSection === "edit-profile" ||
                (!hoveredSection && activeSection === "edit-profile")
                  ? "opacity-100"
                  : "opacity-50"
              } transition-opacity duration-300 py-[25px]`}
            >
              <EditProfile />
            </div>

            <div
              id="notifications"
              className={`${
                hoveredSection === "notifications" ||
                (!hoveredSection && activeSection === "notifications")
                  ? "opacity-100"
                  : "opacity-50"
              } transition-opacity duration-300 py-[25px]`}
            >
              <Notifications />
            </div>

            <div
              id="appearance"
              className={`${
                hoveredSection === "appearance" ||
                (!hoveredSection && activeSection === "appearance")
                  ? "opacity-100"
                  : "opacity-50"
              } transition-opacity duration-300 py-[25px]`}
            >
              <Appearance />
            </div>

            <div
              id="content-moderation"
              className={`${
                hoveredSection === "content-moderation" ||
                (!hoveredSection && activeSection === "content-moderation")
                  ? "opacity-100"
                  : "opacity-50"
              } transition-opacity duration-300 py-[25px]`}
            >
              <ContentModeration />
            </div>

            <div
              id="video-player"
              className={`${
                hoveredSection === "video-player" ||
                (!hoveredSection && activeSection === "video-player")
                  ? "opacity-100"
                  : "opacity-50"
              } transition-opacity duration-300 py-[25px]`}
            >
              <VideoPlayer />
            </div>

            <div
              id="change-email"
              className={`${
                hoveredSection === "change-email" ||
                (!hoveredSection && activeSection === "change-email")
                  ? "opacity-100"
                  : "opacity-50"
              } transition-opacity duration-300 py-[25px]`}
            >
              <ChangeEmail />
            </div>

            <div
              id="password-security"
              className={`${
                hoveredSection === "password-security" ||
                (!hoveredSection && activeSection === "password-security")
                  ? "opacity-100"
                  : "opacity-50"
              } transition-opacity duration-300 py-[25px]`}
            >
              <PasswordSecurity />
            </div>

            <div
              id="delete-account"
              className={`${
                hoveredSection === "delete-account" ||
                (!hoveredSection && activeSection === "delete-account")
                  ? "opacity-100"
                  : "opacity-50"
              } transition-opacity duration-300 py-[25px] mb-[100px]`}
            >
              <DeleteAccount />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
