import Link from "next/link";
import PostReactionBtns from "../buttons/PostReactionBtns";
import React from "react";

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
  const defaultProfilePicture =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg5CvxCysqjZrsTPUjcl5sN3HIzePiCWM7KQ&s";

  const parseTextWithMedia = (inputText: string | undefined) => {
    if (!inputText) return null;

    const mediaRegex = /(https:\/\/.*?\.(jpg|jpeg|png|gif|mp4|avi|mov))/g;
    let parts = [];
    let lastIndex = 0;

    let match;
    while ((match = mediaRegex.exec(inputText)) !== null) {
      const textBeforeMedia = inputText.slice(lastIndex, match.index);
      parts.push(
        textBeforeMedia.split("\n").map((line, index, array) => (
          <React.Fragment key={`${lastIndex}-${index}`}>
            {line}
            {index < array.length + 1 && <br />}
          </React.Fragment>
        ))
      );

      const mediaLink = match[0];
      const isImage = /\.(jpg|jpeg|png|gif)$/.test(mediaLink);
      if (isImage) {
        parts.push(
          <img
            key={mediaLink}
            src={mediaLink}
            alt="User uploaded content"
            className="rounded-[10px]"
          />
        );
      } else {
        parts.push(
          <video
            key={mediaLink}
            src={mediaLink}
            className="rounded-[10px]"
            width="100%"
            controls
            autoPlay
            muted
          />
        );
      }

      lastIndex = mediaRegex.lastIndex;
    }

    const remainingText = inputText.slice(lastIndex);
    parts.push(
      remainingText.split("\n").map((line, index, array) => (
        <React.Fragment key={`${lastIndex}-${index}`}>
          {line}
          {index < array.length - 1 && <br />}
        </React.Fragment>
      ))
    );

    return parts;
  };

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
          {parseTextWithMedia(textContent)}
        </p>
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
