import Link from "next/link";

const Settings: React.FC = () => {
  return (
    <>
      <div className="flex justify-center h-[100vh] w-full">
        <div className="flex justify-center gap-[30px] h-full w-[1200px]">
          <div className="sticky mt-[90px] w-[300px]">
            {/* Container */}
            <div>
              <div className="ml-[15px] mb-[20px] flex justify-between items-center">
                <p className="font-bold text-[20px] text-textGray">Settings</p>
                {/* Search */}
                {/* <TooltipBottom text="Search" topStyle="top-[45px]">
        <div className="p-[5px] border border-1 border-[#1D1D1D] bg-[#0C0C0C] rounded-md cursor-pointer hover:border-selectedPurple hover:bg-darkPurple/30 transition ease-in-out duration-200">
          <svg
            width="25"
            height="25"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#878787"
              d="M456.69 421.39L362.6 327.3a173.81 173.81 0 0 0 34.84-104.58C397.44 126.38 319.06 48 222.72 48S48 126.38 48 222.72s78.38 174.72 174.72 174.72A173.81 173.81 0 0 0 327.3 362.6l94.09 94.09a25 25 0 0 0 35.3-35.3ZM97.92 222.72a124.8 124.8 0 1 1 124.8 124.8a124.95 124.95 0 0 1-124.8-124.8Z"
            />
          </svg>
        </div>
      </TooltipBottom> */}
              </div>
              <div className="flex flex-col">
                <Link
                  href="#edit-profile"
                  className="pl-[15px] py-[10px] rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition duration-150 ease-in-out"
                >
                  Edit Profile
                </Link>
                <Link
                  href="#notifications"
                  className="pl-[15px] py-[10px] rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition duration-150 ease-in-out"
                >
                  Notifications
                </Link>
                <Link
                  href="#appearance"
                  className="pl-[15px] py-[10px] rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition duration-150 ease-in-out"
                >
                  Appearance
                </Link>
                <Link
                  href="#your-account"
                  className="pl-[15px] py-[10px] rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition duration-150 ease-in-out"
                >
                  Your Account
                </Link>
                <Link
                  href="#content-moderation"
                  className="pl-[15px] py-[10px] rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition duration-150 ease-in-out"
                >
                  Content Moderation
                </Link>
                <Link
                  href="#video-player"
                  className="pl-[15px] py-[10px] rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition duration-150 ease-in-out"
                >
                  Video Player
                </Link>
              </div>
            </div>
          </div>
          <div className="h-full w-[1.5px] bg-white/10"></div>
          <div className="flex flex-col w-full mt-[90px]">hello</div>
        </div>
      </div>
    </>
  );
};

export default Settings;
