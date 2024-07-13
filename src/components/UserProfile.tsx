"use client";

import FollowButton from "@/components/buttons/FollowButton";
import { User } from "@/types/User";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface UserProfileProps {
  user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    if (!session) return;

    const fetchFollowStatus = async () => {
      try {
        const response = await fetch(
          `/api/follow-status?followerId=${session.user.id}&followingId=${user.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch follow status");
        }
        const data = await response.json();
        setIsFollowing(data.isFollowing);
      } catch (error) {
        console.error("Error fetching follow status:", error);
      }
    };

    fetchFollowStatus();
  }, [session, user.id]);

  const handleFollowChange = (newIsFollowing: boolean) => {
    setIsFollowing(newIsFollowing);
  };

  return (
    <>
      <div className="mt-[60px] flex justify-center">
        {/* Banner */}
        <img
          src={user.profileBanner}
          alt=""
          className="absolute m-auto top-[100px] h-[350px] -z-10 rounded-3xl"
        />
        <div className="flex flex-col gap-[30px] w-[650px] mt-[350px]">
          <div>
            <div className="flex items-center gap-[50px]">
              {/* Profile picture */}
              <img
                src={user.profilePicture}
                alt="Profile picture"
                className="h-[130px] w-[130px] rounded-full border-[4px] border-black"
              />
              <div className="flex items-center gap-[20px] mt-[20px]">
                <FollowButton
                  followerId={session?.user.id || ""}
                  followingId={user.id}
                  isFollowing={isFollowing}
                  onFollowChange={handleFollowChange}
                />
                <button className="flex gap-[10px] font-semibold px-4 py-2 rounded-full bg-indigo-500 active:bg-indigo-700 transition ease-in-out duration-200">
                  <svg
                    width="16"
                    height="23"
                    viewBox="0 0 16 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.941 0.874302C12.0218 0.677323 11.7798 0.507319 11.6218 0.650086L0.782865 10.4491C0.667901 10.553 0.709728 10.7426 0.857757 10.7885L9.38569 13.4328C9.51253 13.4721 9.56652 13.6219 9.49395 13.7331L3.72491 22.5748C3.59531 22.7734 3.85788 22.9924 4.03 22.8292L15.8003 11.6711C15.9037 11.5731 15.8743 11.4014 15.7441 11.3433L9.07788 8.37027C8.97917 8.32624 8.93329 8.21176 8.97429 8.11175L11.941 0.874302Z"
                      fill="#EAB308"
                    />
                  </svg>{" "}
                  Donate
                </button>
                <div className="flex items-center justify-center h-[40px] w-[40px] rounded-full hover:bg-gray-700/40 cursor-pointer">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g fill="#fff">
                      <circle cx="10" cy="15" r="2" />
                      <circle cx="10" cy="10" r="2" />
                      <circle cx="10" cy="5" r="2" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            {/* Profile name */}
            <p className="font-bold text-[20px] mt-[10px]">
              {user.profileName || user.username}
            </p>
            {/* Username */}
            <p className="text-[15px] text-white/50">@{user.username}</p>
            {/* Description */}
            <p className="text-[15px] mt-[10px]">{user.bio}</p>
          </div>
          {/* Profile stats */}
          <div className="flex gap-[30px]">
            <Link
              href="#"
              className="flex flex-col items-center opacity-50 hover:opacity-100 transition"
            >
              <span>FOLLOWERS</span>
              <span className="font-bold text-[20px]">
                {user.followersCount}
              </span>
            </Link>
            <Link
              href="#"
              className="flex flex-col items-center opacity-50 hover:opacity-100 transition"
            >
              <span>FOLLOWING</span>
              <span className="font-bold text-[20px]">
                {user.followingCount}
              </span>
            </Link>
            <Link
              href="#"
              className="flex flex-col items-center opacity-50 hover:opacity-100 transition"
            >
              <span>POSTS</span>
              <span className="font-bold text-[20px]">{user.postsCount}</span>
            </Link>
          </div>
          {/* Content menu */}
          <div className="flex gap-[25px]">
            <button className="px-[20px] py-[5px] rounded-full bg-[#2d104a]">
              All
            </button>
            <button className="px-[20px] py-[5px] rounded-full bg-[#2d104a]">
              Notes
            </button>
            <button className="px-[20px] py-[5px] rounded-full bg-gray-700">
              Pictures
            </button>
            <button className="px-[20px] py-[5px] rounded-full bg-gray-700">
              Videos
            </button>
            <button className="px-[20px] py-[5px] rounded-full bg-gray-700">
              Livestreams
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
