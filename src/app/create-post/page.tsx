"use client";

import Link from "next/link";
import React, { useRef, useState } from "react";
import useAutosizeTextArea from "@/hooks/useAutosizeTextArea";

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [wordCount, setWordCount] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  useAutosizeTextArea(textareaRef.current, text);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setText(newText);
    setCharacterCount(newText.length);
    setWordCount(newText ? newText.trim().split(/\s+/).length : 0);

    const val = event.target?.value;
    setText(val);
  };

  const parseTextWithMedia = (inputText: string) => {
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
    <>
      <div className="flex justify-center mt-[90px]">
        <div className="flex flex-col gap-[30px] w-[800px]">
          <div>
            <h1 className="text-[25px] font-semibold">Create Post</h1>
            <input
              type="text"
              placeholder="Title of post (optional)..."
              value={title}
              onChange={handleTitleChange}
              className="mt-[30px] p-[15px] w-full bg-transparent outline-none border-2 border-blue-500/20 hover:border-blue-500 focus:border-blue-500 rounded-xl transition duration-150 ease-in-out"
            />
            <textarea
              placeholder="Write your post here..."
              value={text}
              onChange={handleTextChange}
              ref={textareaRef}
              className="my-[30px] p-[15px] min-h-[400px] w-full bg-transparent outline-none border-2 border-blue-500/20 hover:border-blue-500 focus:border-blue-500 rounded-xl overflow-hidden transition duration-150 ease-in-out"
            />
            <div className="flex justify-between items-center gap-[30px]">
              <div className="flex gap-[30px]">
                <p className="text-white/50">
                  Character count: {characterCount}
                </p>
                <p className="text-white/50">Word count: {wordCount}</p>
              </div>
              <div className="flex gap-[30px]">
                <Link
                  href={""}
                  className="text-center font-semibold w-[100px] py-[12px] text-green-500 hover:text-white hover:bg-green-700 rounded-xl transition duration-150 ease-in-out"
                >
                  Save Draft
                </Link>
                <Link
                  href={""}
                  className="text-center font-semibold w-[100px] py-[12px] bg-blue-500 rounded-xl transition duration-150 ease-in-out"
                >
                  Publish
                </Link>
                <Link
                  href={""}
                  className="text-center font-semibold w-[100px] py-[12px] bg-red-600 rounded-xl transition duration-150 ease-in-out"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-white/5"></div>
          <div>
            <h1 className="font-bold mb-[20px] text-white/50">Preview Post</h1>
            <div>
              <h1 className="text-[20px] font-bold mb-[10px]">{title}</h1>
              <p>{parseTextWithMedia(text)}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
