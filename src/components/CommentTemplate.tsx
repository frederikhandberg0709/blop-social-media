import Link from "next/link";

export default function CommentTemplate() {
  return (
    <div className="flex flex-col gap-2">
      <Link
        href={`/profile/${username}`}
        className="group flex items-center gap-[10px]"
      >
        <img
          src={profilePicture || defaultProfilePicture}
          alt={`${profileName}'s profile picture`}
          className="h-[40px] w-[40px] rounded-full object-cover"
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
      <div>
        {/* Comment goes here... Supports text, images, and videos just like posts do. */}
      </div>
    </div>
  );
}
