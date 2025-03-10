"use client";

import FollowButton from "@/components/buttons/FollowButton";
import { UserProps } from "@/types/components/user";
import Link from "next/link";
import { useState } from "react";
import PostTemplate from "../../../components/post/PostTemplate";
import ProfilePicture from "../../../components/ProfilePicture";
import DropdownMenu from "@/components/menus/DropdownMenu";
import ProfileNotificationSettingsModal from "../../../components/modals/ProfileNotificationSettingsModal";
import { Tooltip } from "@/components/Tooltip";
import { useUserTimeline } from "@/hooks/api/timelines/useUserTimeline";
import Button from "@/components/buttons/Button";

interface UserProfileProps {
  user: UserProps;
  currentUserId: string | undefined;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, currentUserId }) => {
  const [isNotificationSettingsModalOpen, setIsNotificationSettingsModalOpen] =
    useState<boolean>(false);

  const {
    data: timelineData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useUserTimeline({
    userId: user.id,
  });

  let profileDropdownMenu = [
    {
      label: "Block",
      href: "#",
    },
    {
      label: "Report",
      href: "#",
    },
  ];

  return (
    <>
      <div className="mt-[60px] flex justify-center">
        {/* Banner */}
        {user.profileBanner ? (
          <img
            src={user.profileBanner}
            alt={`${user.profileName || user.username}'s profile banner`}
            className="absolute top-[100px] -z-10 m-auto h-[350px] w-full object-cover min-[1000px]:w-[1000px] min-[1000px]:rounded-3xl"
          />
        ) : null}
        <div className="mt-[350px] flex w-[800px] flex-col gap-[30px]">
          <div>
            <div className="flex items-center gap-[50px]">
              <ProfilePicture
                src={user.profilePicture}
                size={130}
                alt="Profile picture"
                className="border-[4px] border-white dark:border-black"
              />
              <div className="mt-[20px] flex w-full items-center gap-[20px]">
                {currentUserId ? (
                  currentUserId === user.id ? (
                    <Link
                      href={"/settings#edit-profile"}
                      className="rounded-full bg-blue-500 px-4 py-2 font-semibold text-white transition duration-200 ease-in-out hover:bg-blue-600 active:bg-blue-700"
                    >
                      Edit Profile
                    </Link>
                  ) : (
                    <FollowButton userId={user.id} />
                  )
                ) : null}
                {currentUserId && currentUserId !== user.id ? (
                  <div className="flex items-center gap-2.5">
                    <Tooltip
                      text={"Notification Settings"}
                      position="top"
                      offset="50"
                    >
                      <button
                        onClick={() => setIsNotificationSettingsModalOpen(true)}
                        className="group flex size-[40px] select-none items-center justify-center rounded-full font-semibold transition duration-200 ease-in-out hover:bg-gray-700/40 active:bg-gray-700/60"
                      >
                        <svg
                          viewBox="0 0 36 36"
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-6 fill-black/50 group-hover:fill-black dark:fill-white/50 dark:group-hover:fill-white"
                        >
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

                    <DropdownMenu menuItems={profileDropdownMenu} />
                  </div>
                ) : null}
              </div>
            </div>
            {/* Profile name */}
            <p className="text-xl font-bold">
              {user.profileName || user.username}
            </p>
            {/* Username */}
            <p className="text-base opacity-50">@{user.username}</p>
            {/* Description */}
            <p className="mt-2.5 whitespace-pre-wrap text-base">{user.bio}</p>
          </div>
          {/* Profile stats */}
          <div className="flex gap-[30px]">
            <Link
              href="#"
              className="flex flex-col items-center opacity-50 transition hover:opacity-100"
            >
              <span className="text-sm">FOLLOWERS</span>
              <span className="text-[20px] font-bold">
                {user.followersCount}
              </span>
            </Link>
            <Link
              href="#"
              className="flex flex-col items-center opacity-50 transition hover:opacity-100"
            >
              <span className="text-sm">FOLLOWING</span>
              <span className="text-[20px] font-bold">
                {user.followingCount}
              </span>
            </Link>
            <Link
              href="#"
              className="flex flex-col items-center opacity-50 transition hover:opacity-100"
            >
              <span className="text-sm">POSTS</span>
              <span className="text-[20px] font-bold">{user.postsCount}</span>
            </Link>
          </div>
          {/* Content menu */}
          <div className="flex gap-[25px]">
            <button className="rounded-full bg-blue-500 px-[20px] py-[5px] transition duration-200 ease-in-out hover:bg-blue-600 active:scale-95 active:bg-blue-700">
              All
            </button>
            <button className="rounded-full bg-slate-400 px-[20px] py-[5px] transition duration-200 ease-in-out hover:bg-slate-500 active:scale-95 active:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-800 dark:active:bg-slate-900">
              Pictures
            </button>
            <button className="rounded-full bg-slate-400 px-[20px] py-[5px] transition duration-200 ease-in-out hover:bg-slate-500 active:scale-95 active:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-800 dark:active:bg-slate-900">
              Videos
            </button>
          </div>
          <div className="flex w-full flex-col gap-[15px]">
            {timelineData?.pages.map((page) =>
              page.posts.map((post) => (
                <PostTemplate key={`${post.id}-${post.createdAt}`} {...post} />
              )),
            )}

            {hasNextPage && (
              <Button
                variant="secondary"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading more..." : "Load more"}
              </Button>
            )}
          </div>
        </div>
      </div>
      <ProfileNotificationSettingsModal
        isOpen={isNotificationSettingsModalOpen}
        onClose={() => setIsNotificationSettingsModalOpen(false)}
        userProfileId={user.id}
        user={user}
      />
    </>
  );
};

export default UserProfile;
