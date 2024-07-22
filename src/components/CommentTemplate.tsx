"use client";

import Link from "next/link";
import { formatDate } from "@/utils/formattedDate";
import React from "react";
import PostDropdownMenu from "./menus/PostDropdownMenu";

interface CommentProps {
  id: string;
  profilePicture: string | null;
  profileName: string | null;
  username: string;
  timestamp: string;
  title?: string;
  content: string;
  imageContent?: string;
  videoContent?: string;
}

export default function CommentTemplate({
  profilePicture,
  profileName,
  username,
  timestamp,
  title,
  content,
  imageContent,
  videoContent,
}: CommentProps) {
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
        )),
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
          />,
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
          />,
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
      )),
    );

    return parts;
  };
  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex items-center justify-between">
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
        <div className="flex items-center gap-[15px]">
          <div className="text-right text-[15px] text-gray-500">
            {formatDate(timestamp)}
          </div>
          {/* Dropdown button */}
          <PostDropdownMenu />
        </div>
      </div>
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-sm leading-normal">
        {parseTextWithMedia(content)}
      </div>
    </div>
  );
}
