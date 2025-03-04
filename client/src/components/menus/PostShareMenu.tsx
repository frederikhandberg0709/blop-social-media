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
    <div className="border-lightBorder hover:border-lightBorderHover dark:border-darkBorder dark:hover:border-darkBorderHover absolute z-50 mt-3 flex w-[200px] flex-col rounded-xl border bg-white transition duration-200 ease-in-out dark:bg-black">
      <button
        onClick={onShare}
        className={`hover:bg-lightHover active:bg-lightActive dark:hover:bg-darkHover dark:active:bg-darkActive text-primaryGray flex w-full rounded-t-xl px-[20px] py-[10px] font-medium transition duration-200 ease-in-out hover:text-black dark:hover:bg-white/10 dark:hover:text-white dark:active:bg-white/20`}
      >
        {userHasShared ? "Unshare post" : "Share post"}
      </button>
      <button
        onClick={onQuote}
        className={`hover:bg-lightHover active:bg-lightActive dark:bg-darkHover dark:active:bg-darkActive text-primaryGray flex w-full rounded-b-xl px-[20px] py-[10px] font-medium transition duration-200 ease-in-out hover:text-black dark:hover:bg-white/10 dark:hover:text-white dark:active:bg-white/20`}
      >
        Quote post
      </button>
    </div>
  );
};

export default PostShareMenu;
