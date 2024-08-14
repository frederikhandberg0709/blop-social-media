interface ShareMenuProps {
  postId: string;
  onShare: () => void;
  onQuote: () => void;
  userHasShared: boolean;
}

const PostShareMenu: React.FC<ShareMenuProps> = ({
  postId,
  onShare,
  onQuote,
  userHasShared,
}) => {
  return (
    <div className="absolute z-50 mt-3 flex w-[200px] flex-col rounded-xl border border-lightBorder bg-white transition duration-200 ease-in-out hover:border-lightBorderHover dark:border-darkBorder dark:bg-black dark:hover:border-darkBorderHover">
      <button
        onClick={onShare}
        className={`hover:bg-light-hover active:bg-light-active flex w-full rounded-t-xl px-[20px] py-[10px] font-medium text-primaryGray transition duration-200 ease-in-out hover:text-black dark:hover:bg-white/10 dark:hover:text-white dark:active:bg-white/20`}
      >
        {userHasShared ? "Unshare post" : "Share post"}
      </button>
      <button
        onClick={onQuote}
        className={`hover:bg-light-hover active:bg-light-active flex w-full rounded-b-xl px-[20px] py-[10px] font-medium text-primaryGray transition duration-200 ease-in-out hover:text-black dark:hover:bg-white/10 dark:hover:text-white dark:active:bg-white/20`}
      >
        Quote post
      </button>
    </div>
  );
};

export default PostShareMenu;
