import Link from "next/link";

interface NavProfileMenuProps {
  profilePicture: string;
  profileName: string;
  username: string;
}

const NavProfileMenu: React.FC<NavProfileMenuProps> = ({
  profilePicture,
  profileName,
  username,
}) => {
  return (
    <div className="fixed z-50 top-[90px] right-[20px] rounded-[10px] p-[10px] w-[280px] bg-black border border-blue-500/10 hover:border-blue-500 transition ease-in-out duration-150">
      <div className="flex flex-col gap-[10px]">
        <Link
          href={"/profile"}
          className="flex gap-[12px] items-center p-[10px] rounded-[5px] hover:bg-gray-500/10 transition ease-in-out duration-150 group"
        >
          <img
            src={profilePicture}
            alt="Profile picture"
            className="rounded-full w-[40px] h-[40px] object-cover"
          />
          <div className="group">
            <p className="font-bold text-[15px] group-hover:text-blue-500">
              {profileName}
            </p>
            <p className="text-[14px] text-gray-500">@{username}</p>
          </div>
        </Link>
        <div className="w-full h-[1px] bg-gray-500/10"></div>
        <Link
          href={""}
          className="flex gap-[10px] px-[10px] py-[10px] rounded-[5px] font-medium text-white/50 hover:text-white hover:bg-gray-500/10 transition ease-in-out duration-150"
        >
          My Profile
        </Link>
      </div>
    </div>
  );
};

export default NavProfileMenu;
