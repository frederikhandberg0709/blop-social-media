import Link from "next/link";
import PostReactionBtns from "../buttons/PostReactionBtns";

interface PostProps {
  profilePicture: string | null;
  profileName: string | null;
  username: string;
  timestamp: string;
  textContent: string;
  imageContent?: string;
  videoContent?: string;
}

const PostTemplate: React.FC<PostProps> = ({
  profilePicture,
  profileName,
  username,
  timestamp,
  textContent,
  imageContent,
  videoContent,
}) => {
  const defaultProfilePicture = "/default-profile.png";

  return (
    <div className="flex flex-col gap-[10px] sm:w-[800px] w-[90%] sm:border border-gray-900 hover:border-gray-800 transition duration-200 bg-black sm:p-[15px] sm:rounded-[15px]">
      <div className="flex items-center justify-between">
        <Link
          href={`/profile/${username}`}
          className="flex items-center gap-[10px] group"
        >
          <img
            src={profilePicture || defaultProfilePicture}
            alt={`${profileName}'s profile picture`}
            className="rounded-full h-[40px] w-[40px] object-cover"
          />
          <div className="flex flex-col gap-[1px]">
            {/* If user has profile name */}
            {profileName ? (
              <>
                <div className="font-bold text-[13px] group-hover:text-blue-500">
                  {profileName}
                </div>
                <div className="text-[13px] text-gray-500">@{username}</div>
              </>
            ) : (
              // No profile name, only show username
              <div className="font-bold text-[15px] group-hover:text-blue-500">
                @{username}
              </div>
            )}
          </div>
        </Link>
        <div className="flex items-center gap-[15px]">
          <div className="text-[15px] text-right text-gray-500">
            {timestamp}
          </div>
          {/* Dropdown button */}
        </div>
      </div>
      <div className="flex flex-col gap-[10px]">
        <p className="text-[15px] leading-normal overflow-x-hidden">
          {textContent}
        </p>
        {imageContent && (
          <div className="">
            <img
              src={imageContent}
              alt="Post image"
              className="w-full rounded-md"
            />
          </div>
        )}
        {videoContent && (
          <div className="">
            <video controls className="w-full rounded-md">
              <source src={videoContent} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
      <PostReactionBtns
        likeCount={0}
        commentCount={0}
        shareCount={0}
        donateCount={0}
      />
    </div>
  );
};

export default PostTemplate;
