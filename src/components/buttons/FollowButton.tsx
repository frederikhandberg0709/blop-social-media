"use client";

import { useState } from "react";

interface FollowButtonProps {
  followerId: string;
  followingId: string;
  isFollowing: boolean;
  onFollowChange: (isFollowing: boolean) => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  followerId,
  followingId,
  isFollowing,
  onFollowChange,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleFollow = async () => {
    try {
      const response = await fetch("/api/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followerId, followingId }),
      });

      if (!response.ok) {
        throw new Error("Failed to follow user");
      }

      onFollowChange(true);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await fetch("/api/unfollow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followerId, followingId }),
      });

      if (!response.ok) {
        throw new Error("Failed to unfollow user");
      }

      onFollowChange(false);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <button
      onClick={isFollowing ? handleUnfollow : handleFollow}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`py-2 px-4 min-w-[106px] font-semibold text-center rounded-full transition duration-150 ease-in-out ${
        isFollowing
          ? "bg-green-500 hover:bg-red-500"
          : "bg-blue-500 hover:bg-blue-700"
      } text-white`}
    >
      {isHovered && isFollowing
        ? "Unfollow"
        : isFollowing
        ? "Following"
        : "Follow"}
    </button>
  );
};

export default FollowButton;
