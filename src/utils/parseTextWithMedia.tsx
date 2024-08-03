import React from "react";

export const parseTextWithMedia = (
  inputText: string,
  handleImageClick: (src: string) => void,
) => {
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

// import React from "react";

// export const parseTextWithMedia = (
//   inputText: string,
// ): (string | React.ReactNode)[] => {
//   const mediaRegex = /(https:\/\/.*?\.(jpg|jpeg|png|gif|mp4|avi|mov))/g;
//   let parts: (string | React.ReactNode)[] = [];
//   let lastIndex = 0;

//   let match;
//   while ((match = mediaRegex.exec(inputText)) !== null) {
//     const textBeforeMedia = inputText.slice(lastIndex, match.index);
//     parts.push(
//       ...textBeforeMedia.split("\n").map((line, index, array) => (
//         <React.Fragment key={`${lastIndex}-${index}`}>
//           {line}
//           {index < array.length - 1 && <br />}
//         </React.Fragment>
//       )),
//     );

//     const mediaLink = match[0];
//     const isImage = /\.(jpg|jpeg|png|gif)$/.test(mediaLink);
//     if (isImage) {
//       parts.push(
//         <img
//           key={mediaLink}
//           src={mediaLink}
//           alt="User uploaded content"
//           className="rounded-[10px]"
//         />,
//       );
//     } else {
//       parts.push(
//         <video
//           key={mediaLink}
//           src={mediaLink}
//           className="rounded-[10px]"
//           width="100%"
//           controls
//           autoPlay
//           muted
//         />,
//       );
//     }

//     lastIndex = mediaRegex.lastIndex;
//   }

//   const remainingText = inputText.slice(lastIndex);
//   parts.push(
//     ...remainingText.split("\n").map((line, index, array) => (
//       <React.Fragment key={`${lastIndex}-${index}`}>
//         {line}
//         {index < array.length - 1 && <br />}
//       </React.Fragment>
//     )),
//   );

//   return parts;
// };
