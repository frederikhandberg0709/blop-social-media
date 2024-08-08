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
      <div className="flex w-full justify-center">
        <div className="flex h-full w-[1200px] justify-center gap-[30px]">
          <div className="sticky top-0 flex h-[100vh] gap-[30px] pt-[70px]">
            <div className="mt-[20px] w-[250px]">
              <div className="mb-[20px] ml-[15px] flex items-center justify-between">
                <p className="text-[20px] font-bold">Settings</p>
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
                    className={`rounded-xl py-[10px] pl-[15px] ${
                      hoveredSection === section ||
                      (!hoveredSection && activeSection === section)
                        ? "text-white"
                        : "text-white/50"
                    } transition duration-150 ease-in-out hover:bg-white/10 hover:text-white active:bg-white/20`}
                  >
                    {section
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Link>
                ))}
              </div>
            </div>
            <div className="relative right-0 h-full w-[1.5px] bg-white/10"></div>
          </div>
          <div className="mt-[90px] w-full">
            <div id="edit-profile" className="py-[25px]">
              <EditProfile />
            </div>

            <div id="notifications" className="py-[25px]">
              <Notifications />
            </div>

            <div id="appearance" className="py-[25px]">
              <Appearance />
            </div>

            <div id="content-moderation" className="py-[25px]">
              <ContentModeration />
            </div>

            <div id="video-player" className="py-[25px]">
              <VideoPlayer />
            </div>

            <div id="change-email" className="py-[25px]">
              <ChangeEmail />
            </div>

            <div id="password-security" className="py-[25px]">
              <PasswordSecurity />
            </div>

            <div id="delete-account" className="py-[25px]">
              <DeleteAccount />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
