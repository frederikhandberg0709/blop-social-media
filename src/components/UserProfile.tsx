"use client";

import FollowButton from "@/components/buttons/FollowButton";
import { UserProps } from "@/types/UserProps";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import PostTemplate from "./post/PostTemplate";
import { PostProps } from "@/types/PostProps";
import ProfilePicture from "./ProfilePicture";

interface UserProfileProps {
  user: UserProps;
  posts: PostProps[];
  currentUserId: string | undefined;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  posts,
  currentUserId,
}) => {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    if (!session) return;

    const fetchFollowStatus = async () => {
      try {
        const response = await fetch(
          `/api/follow-status?followerId=${session.user.id}&followingId=${user.id}`,
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
          className="absolute top-[100px] -z-10 m-auto h-[350px] rounded-3xl"
        />
        <div className="mt-[350px] flex w-[650px] flex-col gap-[30px]">
          <div>
            <div className="flex items-center gap-[50px]">
              {/* Profile picture */}
              <ProfilePicture
                src={user.profilePicture}
                size={130}
                alt="Profile picture"
                className="border-[4px] border-white dark:border-black"
              />
              <div className="mt-[20px] flex items-center gap-[20px]">
                {currentUserId ? (
                  currentUserId === user.id ? (
                    <Link
                      href={"/settings#edit-profile"}
                      className="rounded-full bg-blue-500 px-4 py-2 font-semibold text-white transition duration-200 ease-in-out hover:bg-blue-600"
                    >
                      Edit Profile
                    </Link>
                  ) : (
                    <FollowButton
                      followerId={currentUserId}
                      followingId={user.id}
                      isFollowing={isFollowing}
                      onFollowChange={handleFollowChange}
                    />
                  )
                ) : null}
                <button className="flex gap-[10px] rounded-full bg-indigo-500 px-4 py-2 font-semibold transition duration-200 ease-in-out active:bg-indigo-700">
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
                <div className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full hover:bg-gray-700/40">
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
            <p className="mt-[10px] text-[20px] font-bold">
              {user.profileName || user.username}
            </p>
            {/* Username */}
            <p className="text-[15px] opacity-50">@{user.username}</p>
            {/* Description */}
            <p className="mt-[10px] text-[15px]">{user.bio}</p>
          </div>
          {/* Profile stats */}
          <div className="flex gap-[30px]">
            <Link
              href="#"
              className="flex flex-col items-center opacity-50 transition hover:opacity-100"
            >
              <span>FOLLOWERS</span>
              <span className="text-[20px] font-bold">
                {user.followersCount}
              </span>
            </Link>
            <Link
              href="#"
              className="flex flex-col items-center opacity-50 transition hover:opacity-100"
            >
              <span>FOLLOWING</span>
              <span className="text-[20px] font-bold">
                {user.followingCount}
              </span>
            </Link>
            <Link
              href="#"
              className="flex flex-col items-center opacity-50 transition hover:opacity-100"
            >
              <span>POSTS</span>
              <span className="text-[20px] font-bold">{user.postsCount}</span>
            </Link>
          </div>
          {/* Content menu */}
          <div className="flex gap-[25px]">
            <button className="rounded-full bg-[#2d104a] px-[20px] py-[5px]">
              All
            </button>
            <button className="rounded-full bg-[#2d104a] px-[20px] py-[5px]">
              Notes
            </button>
            <button className="rounded-full bg-gray-700 px-[20px] py-[5px]">
              Pictures
            </button>
            <button className="rounded-full bg-gray-700 px-[20px] py-[5px]">
              Videos
            </button>
            <button className="rounded-full bg-gray-700 px-[20px] py-[5px]">
              Livestreams
            </button>
          </div>
          <div>
            {posts?.map((post) => (
              <PostTemplate
                key={post.id}
                id={post.id}
                user={post.user}
                createdAt={post.createdAt}
                updatedAt={post.updatedAt}
                timestamp={post.updatedAt || post.createdAt}
                title={post.title}
                content={post.content}
                initialLikesCount={post.initialLikesCount ?? 0}
                userLiked={post.userLiked}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
