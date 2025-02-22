import Link from "next/link";

const NavSearchResults = () => {
  return (
    <>
      <div className="py-[10px]">
        {/* Nothing types display lastest searches (5* search history) */}
        <div>
          <div className="flex gap-[50px]">
            <h1 className="pl-[20px] text-sm font-bold text-white/50">
              Search History
            </h1>
            <Link
              href={"#"}
              className="text-sm font-medium text-blue-500 hover:underline"
            >
              Show all
            </Link>
          </div>
          <div className="mt-[5px] flex flex-col gap-[5px]">
            <Link
              href={"#"}
              className="px-[20px] py-[5px] text-sm text-white/65 hover:bg-white/10 hover:text-white"
            >
              Here is a search result
            </Link>
          </div>
        </div>
        <div className="mt-[20px]">
          <h1 className="pl-[20px] text-sm font-bold text-white/50">
            Profiles You Might Like
          </h1>
          <div className="mt-[5px]">
            <Link
              href={"#"}
              className="flex items-center gap-[10px] px-[20px] py-[10px] hover:bg-white/10"
            >
              <img
                src="#"
                alt="Profile picture"
                className="h-[40px] w-[40px] rounded-full object-cover"
              />
              <div>
                <p className="text-[15px] font-bold group-hover:text-blue-500">
                  Profile Name
                </p>
                <p className="text-[14px] text-gray-500">@username</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavSearchResults;
