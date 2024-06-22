const NotificationPanel = () => {
  return (
    <>
      <div className="fixed z-50 top-[90px] right-[20px] rounded-[10px] p-[10px] w-[350px] bg-black border-2 border-blue-500/10 hover:border-blue-500 transition ease-in-out duration-150">
        <div className="flex justify-between px-[20px]">
          <div className="flex items-center gap-[10px]">
            <h1 className="text-white/50 text-[15px] font-bold ">
              NOTIFICATIONS
            </h1>
            <div className="flex items-center justify-center font-bold rounded-full w-[25px] h-[25px] bg-red-700">
              5
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
