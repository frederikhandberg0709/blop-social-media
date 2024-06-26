import Link from "next/link";

const NavSearchResults = () => {
  return (
    <>
      <div className="py-[10px]">
        {/* Nothing types display lastest searches (5* search history) */}
        <div>
          <div className="flex gap-[50px]">
            <h1 className="font-bold text-white/50 pl-[20px]">
              Search History
            </h1>
            <Link
              href={""}
              className="font-medium text-white/50  hover:text-white"
            >
              Show all
            </Link>
          </div>
          <div className="flex flex-col gap-[5px] mt-[5px]">
            <Link
              href={""}
              className="py-[5px] px-[20px] text-white/65 hover:text-white hover:bg-white/20"
            >
              Here is a search result
            </Link>
          </div>
        </div>
        <div className="mt-[20px]">
          <h1 className="font-bold text-white/50 pl-[20px]">
            Profiles You Might Like
          </h1>
          <div className="mt-[5px]">
            <Link
              href={""}
              className="flex gap-[10px] items-center py-[10px] px-[20px] hover:bg-white/10"
            >
              <img
                src=""
                alt="Profile picture"
                className="rounded-full w-[40px] h-[40px] object-cover"
              />
              <div>
                <p className="font-bold text-[15px] group-hover:text-blue-500">
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
