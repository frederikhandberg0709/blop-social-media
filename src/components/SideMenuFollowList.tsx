import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface User {
  id: string;
  username: string;
  profileName?: string;
  profilePicture?: string;
}

export default function SideMenuFollowList() {
  const { data: session } = useSession();
  const [following, setFollowing] = useState<User[]>([]);
  const [showAll, setShowAll] = useState(false);
  const pathname = usePathname();
  const currentPage = pathname;

  useEffect(() => {
    if (!session) return;

    const fetchFollowing = async () => {
      try {
        const response = await fetch(
          `/api/following?userId=${session.user.id}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch following list");
        }
        const data = await response.json();
        setFollowing(data);
      } catch (error) {
        console.error("Error fetching following list:", error);
      }
    };

    fetchFollowing();
  }, [session]);

  if (!session) {
    return <p>Loading...</p>;
  }

  const displayedUsers = showAll ? following : following.slice(0, 10);

  return (
    <div>
      <div className="flex items-center gap-4 pb-[10px]">
        <h1 className="pl-[20px] text-sm font-bold text-primaryGray">
          FOLLOWING
        </h1>
        <p className="text-sm text-primaryGray">{following.length}</p>
      </div>
      <div className="flex flex-col gap-[5px]">
        {displayedUsers
          .map((user) => (
            <Link
              key={user.id}
              href={`/profile/${user.username}`}
              className={`flex items-center gap-[10px] rounded-xl px-[20px] py-[10px] text-[17px] transition duration-150 ease-in-out hover:bg-lightHover active:bg-lightActive dark:hover:bg-darkHover dark:active:bg-darkActive ${
                (currentPage === `/profile/${user.username}` &&
                  "text-black dark:text-white") ||
                "text-primaryGray hover:text-black dark:hover:text-white"
              }`}
            >
              <img
                src={user.profilePicture || ""}
                className="h-[30px] w-[30px] rounded-full bg-white"
                alt="Profile picture"
              />
              {user.profileName || user.username}
            </Link>
          ))
          .slice(0, 10)}
      </div>
      {following.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="hover:text-hoverBlue mt-4 self-center rounded-lg text-primaryBlue hover:underline"
        >
          {showAll ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
