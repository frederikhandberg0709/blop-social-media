"use client";

import { useCreateFollow } from "@/hooks/api/follow/useCreateFollow";
import { useDeleteFollow } from "@/hooks/api/follow/useDeleteFollow";
import { useFollowStatus } from "@/hooks/api/follow/useFollowStatus";
import { useState } from "react";

interface FollowButtonProps {
  userId: string;
  onSuccess?: () => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId, onSuccess }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { data: followStatus, refetch } = useFollowStatus({ userId });
  const { mutate: followUser, isPending: isFollowingUser } = useCreateFollow();
  const { mutate: unfollowUser, isPending: isUnfollowingUser } =
    useDeleteFollow();

  const isFollowing = followStatus?.isFollowing;

  const handleFollow = () => {
    followUser({ userId });
  };

  const handleUnfollow = () => {
    unfollowUser({ userId });
  };

  return (
    <button
      onClick={isFollowing ? handleUnfollow : handleFollow}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isFollowingUser || isUnfollowingUser}
      className={`min-w-[106px] rounded-full px-4 py-2 text-center font-semibold transition duration-150 ease-in-out ${
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
