import Link from "next/link";
import ProfilePicture from "./ProfilePicture";
import { UserProps } from "@/types/UserProps";

export default function Author({
  username,
  profileName,
  profilePicture,
}: {
  username: string;
  profileName: string | null;
  profilePicture: string | null;
}) {
  return (
    <Link
      href={`/profile/${username}`}
      className="group flex items-center gap-[10px]"
    >
      <ProfilePicture
        src={profilePicture}
        alt={`${profileName}'s profile picture`}
      />
      <div className="flex flex-col gap-[1px]">
        {/* If user has profile name */}
        {profileName ? (
          <>
            <div className="text-[15px] font-bold group-hover:text-blue-500">
              {profileName}
            </div>
            <div className="text-[12px] text-gray-500">@{username}</div>
          </>
        ) : (
          // No profile name, only show username
          <>
            <div className="text-[15px] font-bold group-hover:text-blue-500">
              {username}
            </div>
            <div className="text-[12px] text-gray-500">@{username}</div>
          </>
        )}
      </div>
    </Link>
  );
}
