import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfilePicture from "./ProfilePicture";
import {
  useFollowing,
  useFollowingCount,
} from "@/hooks/api/follow/useFollowing";

interface SideMenuFollowListProps {
  id: string;
}

export default function SideMenuFollowList({ id }: SideMenuFollowListProps) {
  const { data: session } = useSession();
  const [showAll, setShowAll] = useState(false);
  const pathname = usePathname();
  const currentPage = pathname;

  const { data: followingCount } = useFollowingCount({ userId: id });

  const { data: following, isPending: isPendingFollowing } = useFollowing({
    userId: id,
  });

  if (!session) {
    return <p>Loading...</p>;
  }

  if (isPendingFollowing) {
    return <p>Loading following list...</p>;
  }

  const displayedUsers = showAll ? following : following?.slice(0, 10);

  const count = followingCount?.count || 0;

  return (
    <div>
      <div className="flex items-center gap-4 pb-[10px]">
        <h1 className="text-primaryGray pl-[20px] text-sm font-bold">
          FOLLOWING
        </h1>
        <p className="text-primaryGray text-sm">{count}</p>
      </div>
      <div className="flex flex-col gap-[5px]">
        {!following || following.length === 0 ? (
          <p className="text-primaryGray pl-[20px] text-sm">
            Not following anyone yet
          </p>
        ) : (
          displayedUsers?.map((user) => (
            <Link
              key={user.id}
              href={`/profile/${user.username}`}
              className={`hover:bg-lightHover active:bg-lightActive dark:hover:bg-darkHover dark:active:bg-darkActive flex items-center gap-2.5 overflow-hidden whitespace-nowrap rounded-xl px-[20px] py-2.5 text-base transition duration-150 ease-in-out ${
                (currentPage === `/profile/${user.username}` &&
                  "text-black dark:text-white") ||
                "text-primaryGray hover:text-black dark:hover:text-white"
              }`}
            >
              <ProfilePicture
                src={user.profilePicture}
                size={30}
                alt={`${user.profileName}'s profile picture`}
              />
              <span className="overflow-hidden text-ellipsis">
                {user.profileName || user.username}
              </span>
            </Link>
          ))
        )}
      </div>
      {count > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-primaryBlue hover:text-hoverBlue mt-4 self-center rounded-lg hover:underline"
        >
          {showAll ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
