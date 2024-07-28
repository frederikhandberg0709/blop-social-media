import { useState } from "react";
import { Tooltip } from "../Tooltip";

interface PostActionButtonsProps {
  likesCount: number;
  commentsCount: number;
  onCommentClick: () => void;
  sharesCount: number;
  donationCount: number;
  liked: boolean;
  onLike: () => void;
  onUnlike: () => void;
}

const PostActionButtons: React.FC<PostActionButtonsProps> = ({
  likesCount,
  commentsCount,
  onCommentClick,
  sharesCount,
  donationCount,
  liked,
  onLike,
  onUnlike,
}) => {
  const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);

  return (
    <div className="flex gap-[15px]">
      <Tooltip text={liked ? "Unlike" : "Like"} position="top" offset="40">
        <button
          onClick={liked ? onUnlike : onLike}
          className={`flex w-[90px] cursor-pointer items-center justify-center gap-[5px] rounded-full fill-red-500 py-[3px] transition-colors duration-200 hover:bg-red-500/25 active:bg-red-500/50`}
        >
          {/* Like icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2 9.137C2 14 6.02 16.591 8.962 18.911C10 19.729 11 20.5 12 20.5s2-.77 3.038-1.59C17.981 16.592 22 14 22 9.138c0-4.863-5.5-8.312-10-3.636C7.5.825 2 4.274 2 9.137Z" />
          </svg>{" "}
          <span className="text-md select-none">{likesCount}</span>
        </button>
      </Tooltip>
      <Tooltip
        text={isCommentSectionVisible ? "Close Comments" : "Comments"}
        position="top"
        offset="40"
      >
        <button
          onClick={() => {
            setIsCommentSectionVisible(!isCommentSectionVisible);
            onCommentClick();
          }}
          className="flex w-[90px] cursor-pointer items-center justify-center gap-[5px] rounded-full fill-blue-500 py-[3px] transition-colors duration-200 hover:bg-blue-500/25 active:bg-blue-500/50"
        >
          {/* Comment icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#3b82f6"
              d="M20 6h-1v8c0 .55-.45 1-1 1H6v1c0 1.1.9 2 2 2h10l4 4V8c0-1.1-.9-2-2-2zm-3 5V4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v13l4-4h9c1.1 0 2-.9 2-2z"
            />
          </svg>{" "}
          <span className="text-md select-none">{commentsCount}</span>
        </button>
      </Tooltip>
      <Tooltip text={"Share"} position="top" offset="40">
        <button className="flex w-[90px] cursor-pointer items-center justify-center gap-[5px] rounded-full fill-green-500 py-[3px] transition-colors duration-200 hover:bg-green-500/25 active:bg-green-500/50">
          {/* Share icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#10B981"
              d="M136 552h63.6c4.4 0 8-3.6 8-8V288.7h528.6v72.6c0 1.9.6 3.7 1.8 5.2a8.3 8.3 0 0 0 11.7 1.4L893 255.4c4.3-5 3.6-10.3 0-13.2L749.7 129.8a8.22 8.22 0 0 0-5.2-1.8c-4.6 0-8.4 3.8-8.4 8.4V209H199.7c-39.5 0-71.7 32.2-71.7 71.8V544c0 4.4 3.6 8 8 8zm752-80h-63.6c-4.4 0-8 3.6-8 8v255.3H287.8v-72.6c0-1.9-.6-3.7-1.8-5.2a8.3 8.3 0 0 0-11.7-1.4L131 768.6c-4.3 5-3.6 10.3 0 13.2l143.3 112.4c1.5 1.2 3.3 1.8 5.2 1.8c4.6 0 8.4-3.8 8.4-8.4V815h536.6c39.5 0 71.7-32.2 71.7-71.8V480c-.2-4.4-3.8-8-8.2-8z"
            />
          </svg>{" "}
          <span className="text-md select-none">{sharesCount}</span>
        </button>
      </Tooltip>
    </div>
  );
};

export default PostActionButtons;
