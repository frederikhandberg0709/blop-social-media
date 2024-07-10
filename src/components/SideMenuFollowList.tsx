import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface User {
  id: string;
  username: string;
  profileName?: string;
  profilePicture?: string;
}

export default function SideMenuFollowList() {
  const { data: session } = useSession();
  const [following, setFollowing] = useState<User[]>([]);

  useEffect(() => {
    if (!session) return;

    const fetchFollowing = async () => {
      try {
        const response = await fetch(
          `/api/following?userId=${session.user.id}`
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

  return (
    <div>
      <div>
        <h1 className="text-white/50 text-[15px] font-bold px-[20px] pb-[10px]">
          FOLLOWING
        </h1>
        {/* <p className="text-white/50 text-[15px]">{followingCount}</p> */}
      </div>
      <div className="flex flex-col gap-[5px]">
        {following.map((user) => (
          <Link
            key={user.id}
            href={`/profile/${user.username}`}
            className="flex items-center gap-[10px] text-[17px] hover:bg-white/10 rounded-xl px-[20px] py-[10px]"
          >
            <Image
              src=""
              className="bg-white rounded-full h-[30px] w-[30px]"
              alt="Profile picture"
            />
            {user.profileName || user.username}
          </Link>
        ))}
      </div>
    </div>
  );
}
