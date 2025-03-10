import { useProfileNotificationSettings } from "@/hooks/api/notifications/useProfileNotificationSettings";
import { useEffect, useRef } from "react";
import Author from "../Author";
import { UserProps } from "@/types/components/user";
import { NotificationSettingType } from "@/types/components/notification";

const ProfileNotificationSettingsModal = ({
  isOpen,
  onClose,
  userProfileId,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  userProfileId: string;
  user: UserProps;
}) => {
  const { settings, updateLocalSettings, saveSettings, isLoading } =
    useProfileNotificationSettings(userProfileId);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleMainOptionChange = (option: typeof settings.mainOption) => {
    const newSettings = {
      ...settings,
      mainOption: option,
      targetProfileId: userProfileId,
    };

    if (option === NotificationSettingType.ALL) {
      newSettings.newPost = true;
      newSettings.reply = true;
      newSettings.share = true;
    } else if (option === NotificationSettingType.SPECIFIC) {
      if (!settings.newPost && !settings.reply && !settings.share) {
        newSettings.newPost = true;
      }
    } else if (option === NotificationSettingType.DISABLE) {
      newSettings.newPost = false;
      newSettings.reply = false;
      newSettings.share = false;
    }

    updateLocalSettings(newSettings);
  };

  const handleSubOptionChange = (option: "newPost" | "reply" | "share") => {
    const newValue = !settings[option];

    if (!newValue) {
      const otherOptionsEnabled =
        (option === "newPost" && (settings.reply || settings.share)) ||
        (option === "reply" && (settings.newPost || settings.share)) ||
        (option === "share" && (settings.newPost || settings.reply));

      if (!otherOptionsEnabled) return;
    }

    updateLocalSettings({
      ...settings,
      targetProfileId: userProfileId,
      mainOption: NotificationSettingType.SPECIFIC,
      [option]: newValue,
    });
  };

  const handleSave = () => {
    saveSettings(settings);
    onClose();
  };

  if (!isOpen) return null;
  if (isLoading || !settings) return <div>Loading...</div>;

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-40 flex h-full w-full items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="border-lightBorder hover:border-lightBorderHover dark:border-darkBorder dark:hover:border-darkBorderHover w-[300px] rounded-xl border-2 bg-white pt-2 transition duration-150 ease-in-out dark:bg-black"
      >
        <h1 className="text-center font-semibold">
          Profile Notification Settings
        </h1>

        <div className="m-5">
          <Author
            username={user.username}
            profileName={user.profileName}
            profilePicture={user.profilePicture}
          />

          <p className="mb-2.5 mt-3 text-sm text-gray-400">Select an option:</p>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                checked={settings.mainOption === NotificationSettingType.ALL}
                onChange={() =>
                  handleMainOptionChange(NotificationSettingType.ALL)
                }
                className="h-4 w-4 text-blue-600"
              />
              <span className="select-none">All notifications</span>
            </label>

            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  checked={
                    settings.mainOption === NotificationSettingType.SPECIFIC
                  }
                  onChange={() =>
                    handleMainOptionChange(NotificationSettingType.SPECIFIC)
                  }
                  className="h-4 w-4 text-blue-600"
                />
                <span className="select-none">Specific notifications</span>
              </label>

              {settings.mainOption === NotificationSettingType.SPECIFIC && (
                <div className="ml-7 flex flex-col gap-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.newPost}
                      onChange={() => handleSubOptionChange("newPost")}
                      className="h-4 w-4 rounded text-blue-600"
                    />
                    <span className="select-none">Publishes a new post</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.reply}
                      onChange={() => handleSubOptionChange("reply")}
                      className="h-4 w-4 rounded text-blue-600"
                    />
                    <span className="select-none">Publishes a reply</span>
                  </label>

                  <label className="flx items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.share}
                      onChange={() => handleSubOptionChange("share")}
                      className="h-4 w-4 rounded text-blue-600"
                    />
                    <span className="select-none">
                      Shares a post or comment
                    </span>
                  </label>
                </div>
              )}
            </div>

            <label className="flex items-center space-x-3">
              <input
                type="radio"
                checked={
                  settings.mainOption === NotificationSettingType.DISABLE
                }
                onChange={() =>
                  handleMainOptionChange(NotificationSettingType.DISABLE)
                }
                className="h-4 w-4 text-blue-600"
              />
              <span>Disable notifications</span>
            </label>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileNotificationSettingsModal;
