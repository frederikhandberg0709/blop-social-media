import React from "react";

export const parseTextWithMedia = (
  inputText: string,
  handleImageClick: (src: string) => void,
) => {
  const mediaRegex = /(https:\/\/.*?\.(jpg|jpeg|png|gif|mp4|avi|mov))/g;
  const hashtagRegex = /(#\w+)/g;
  let parts: React.ReactNode[] = [];
  let lastIndex = 0;

  const processText = (text: string): React.ReactNode[] => {
    return text.split(hashtagRegex).map((part, index) => {
      if (part.match(hashtagRegex)) {
        return (
          <span key={index} className="font-bold text-blue-500">
            {part}
          </span>
        );
      }
      return part.split("\n").map((line, lineIndex) => (
        <React.Fragment key={`${index}-${lineIndex}`}>
          {line}
          {lineIndex < part.split("\n").length - 1 && <br />}
        </React.Fragment>
      ));
    });
  };

  let match;
  while ((match = mediaRegex.exec(inputText)) !== null) {
    const textBeforeMedia = inputText.slice(lastIndex, match.index);
    parts.push(...processText(textBeforeMedia));

    const mediaLink = match[0];
    const isImage = /\.(jpg|jpeg|png|gif)$/.test(mediaLink);
    if (isImage) {
      parts.push(
        <img
          key={mediaLink}
          src={mediaLink}
          onClick={() => handleImageClick(mediaLink)}
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
  parts.push(...processText(remainingText));

  return parts;
};
