import Link from "next/link";

const NotificationPanel = () => {
  return (
    <>
      <div className="flex justify-between px-[20px]">
        <div className="flex items-center gap-[10px]">
          <h1 className="text-white/50 text-[15px] font-bold ">
            NOTIFICATIONS
          </h1>
          <div className="flex items-center justify-center font-bold rounded-full w-[25px] h-[25px] bg-red-700">
            5
          </div>
        </div>
        <Link
          href={""}
          className="p-[7px] fill-white/50 hover:fill-white active:fill-blue-500 hover:bg-white/10 rounded-full transition duration-150 ease-in-out"
        >
          <svg
            width="25"
            height="25"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19.5 12c0-.23-.01-.45-.03-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23a.987.987 0 0 0-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-.99-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41a7.343 7.343 0 0 0 0 1.35l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88.99.88h3.73c.5 0 .93-.38.99-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.03-.23.04-.45.04-.68zm-7.46 3.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5z" />
          </svg>
        </Link>
      </div>
    </>
  );
};

export default NotificationPanel;
