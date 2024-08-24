import { UserProps } from "@/types/UserProps";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProfilePicture from "../ProfilePicture";

interface NavProfileMenuProps {
  user: UserProps;
  closeMenu: () => void;
}

const NavProfileMenu: React.FC<NavProfileMenuProps> = ({ user, closeMenu }) => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [linkedAccounts, setLinkedAccounts] = useState<UserProps[]>([]);
  const pathname = usePathname();
  const currentPage = pathname;
  const [view, setView] = useState<"menu" | "switch">("menu");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinkedAccounts = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(
            `/api/linked-accounts?userId=${session.user.id}`,
          );
          if (response.ok) {
            const accounts = await response.json();
            setLinkedAccounts(accounts);
          } else {
            console.error("Failed to fetch linked accounts");
          }
        } catch (error) {
          console.error("Error fetching linked accounts:", error);
        }
      }
    };

    fetchLinkedAccounts();
  }, [session]);

  const switchToAccount = async (accountId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/switch-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ linkedAccountId: accountId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to switch account");
      }

      const newUserData = await response.json();

      // Update the session with the new user data
      await update({
        // ...session,
        // user: newUserData,

        switchToUserId: accountId,
      });

      // Close the menu and redirect to the home page
      closeMenu();
      router.push("/home");
      // router.refresh();
      window.location.reload();
    } catch (error) {
      console.error("Error switching account:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchAccount = () => {
    setView("switch");
  };

  const logout = async () => {
    await signOut();
  };

  const displayName = () => {
    if (user.profileName) {
      return user.profileName;
    }
    if (session?.user?.profileName) {
      return session.user.profileName;
    }
    return user.username;
  };

  // For testing:
  // console.log("User prop:", user);
  // console.log("Session user:", session?.user);

  const renderSwitchView = () => (
    <div className="flex flex-col gap-2.5">
      <div className="flex gap-5">
        <button
          onClick={() => setView("menu")}
          className="flex w-full gap-2.5 rounded-xl px-2.5 py-2.5 font-bold text-black/50 transition duration-150 ease-in-out hover:bg-lightHover hover:text-black active:bg-lightActive dark:text-white/50 dark:hover:bg-darkHover dark:hover:text-white dark:active:bg-darkActive"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m3.55 12l7.35 7.35q.375.375.363.875t-.388.875q-.375.375-.875.375t-.875-.375l-7.7-7.675q-.3-.3-.45-.675T.825 12q0-.375.15-.75t.45-.675l7.7-7.7q.375-.375.888-.363t.887.388q.375.375.375.875t-.375.875L3.55 12Z"
            />
          </svg>{" "}
          Switch Account
        </button>
      </div>
      {isLoading && <p>Switching account...</p>}
      {linkedAccounts.length > 0 ? (
        linkedAccounts.map((account) => (
          <button
            key={account.id}
            onClick={() => switchToAccount(account.id)}
            disabled={isLoading}
            className="flex items-center gap-[12px] rounded-xl p-2.5 transition duration-150 ease-in-out hover:bg-lightHover active:bg-lightActive dark:hover:bg-darkHover dark:active:bg-darkActive"
          >
            <ProfilePicture
              src={account.profilePicture}
              alt={account.username}
              size={40}
            />
            <div>
              <p className="text-[15px] font-bold">
                {account.profileName || account.username}
              </p>
              <p className="text-[14px] text-gray-500">@{account.username}</p>
            </div>
          </button>
        ))
      ) : (
        <p className="text-gray-500">No linked accounts found</p>
      )}
      <Link
        href={"/link-account"}
        className="text-md rounded-md bg-gradient-to-b from-blue-500 to-blue-900 py-3 text-center font-semibold text-white hover:from-blue-700 hover:to-blue-900"
      >
        Link New Account
      </Link>
    </div>
  );

  const renderMenuView = () => (
    <div className="flex flex-col gap-2.5">
      <Link
        href={`/profile/${user.username}`}
        onClick={closeMenu}
        className="group flex items-center gap-[12px] rounded-xl p-2.5 transition duration-150 ease-in-out hover:bg-lightHover active:bg-lightActive dark:hover:bg-darkHover dark:active:bg-darkActive"
      >
        <ProfilePicture
          src={user.profilePicture}
          alt={user.username}
          size={50}
        />
        <div className="group">
          <p className="text-[15px] font-bold group-hover:text-blue-500">
            {/* {user.profileName || user.username} */}
            {displayName()}
          </p>
          <p className="text-[14px] text-gray-500">@{user.username}</p>
        </div>
      </Link>
      <div className="h-[1px] w-full bg-blue-500/10"></div>
      <Link
        href={`/profile/${user.username}`}
        onClick={closeMenu}
        className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 font-medium transition duration-150 ease-in-out active:bg-lightActive dark:hover:bg-darkHover dark:active:bg-darkActive ${
          (currentPage === `/profile/${session?.user.username}` &&
            "fill-black text-black dark:fill-white dark:text-white") ||
          "fill-black/50 text-black/50 hover:bg-lightHover hover:fill-black hover:text-black dark:fill-white/50 dark:text-white/50 dark:hover:fill-white dark:hover:text-white"
        }`}
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0Zm0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5H8Z"
            clipRule="evenodd"
          />
        </svg>{" "}
        My Profile
      </Link>
      <Link
        href={"my-bookmarks"}
        className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 font-medium transition duration-150 ease-in-out active:bg-lightActive dark:hover:bg-darkHover dark:active:bg-darkActive ${
          (currentPage === "/my-bookmarks" &&
            "fill-black text-black dark:fill-white dark:text-white") ||
          "fill-primaryGray text-primaryGray hover:bg-lightHover hover:fill-black hover:text-black dark:text-primaryGray dark:hover:fill-white dark:hover:text-white"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="20"
          viewBox="0 0 384 512"
        >
          <path
            fill="currentColor"
            d="M0 48v439.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400l153.7 107.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"
          />
        </svg>{" "}
        My Bookmarks
      </Link>
      <button
        onClick={handleSwitchAccount}
        className="flex gap-2.5 rounded-xl px-2.5 py-2.5 font-medium text-primaryGray transition duration-150 ease-in-out hover:bg-lightHover hover:text-black active:bg-lightActive dark:hover:bg-darkHover dark:hover:text-white dark:active:bg-darkActive"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M14.293 2.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L16.586 8H5a1 1 0 0 1 0-2h11.586l-2.293-2.293a1 1 0 0 1 0-1.414zm-4.586 10a1 1 0 0 1 0 1.414L7.414 16H19a1 1 0 1 1 0 2H7.414l2.293 2.293a1 1 0 0 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0z"
          />
        </svg>{" "}
        Switch Account
      </button>
      <Link
        href={"/settings"}
        onClick={closeMenu}
        className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 font-medium transition duration-150 ease-in-out active:bg-lightActive dark:hover:bg-darkHover dark:active:bg-darkActive ${
          (currentPage === "/settings" &&
            "fill-black text-black dark:fill-white dark:text-white") ||
          "fill-primaryGray text-primaryGray hover:bg-lightHover hover:fill-black hover:text-black dark:text-primaryGray dark:hover:fill-white dark:hover:text-white"
        }`}
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19.5 12c0-.23-.01-.45-.03-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23a.987.987 0 0 0-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-.99-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41a7.343 7.343 0 0 0 0 1.35l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88.99.88h3.73c.5 0 .93-.38.99-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.03-.23.04-.45.04-.68zm-7.46 3.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5z" />
        </svg>{" "}
        Settings
      </Link>
      <button
        onClick={logout}
        className="flex items-center gap-2.5 rounded-xl fill-primaryGray px-2.5 py-2.5 font-medium text-primaryGray transition duration-150 ease-in-out hover:bg-lightHover hover:fill-black hover:text-black active:bg-lightActive dark:hover:bg-darkHover dark:hover:fill-white dark:hover:text-white dark:active:bg-darkActive"
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 5h6c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h6c.55 0 1-.45 1-1s-.45-1-1-1H5V5z" />
          <path d="m20.65 11.65l-2.79-2.79a.501.501 0 0 0-.86.35V11h-7c-.55 0-1 .45-1 1s.45 1 1 1h7v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.19.2-.51.01-.7z" />
        </svg>{" "}
        Logout
      </button>
    </div>
  );

  return <div>{view === "switch" ? renderSwitchView() : renderMenuView()}</div>;
};

export default NavProfileMenu;
