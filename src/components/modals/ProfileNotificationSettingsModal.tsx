import { ProfileNotificationSettingsProps } from "@/types/NotificationProps";
import { useEffect, useRef, useState } from "react";

const ProfileNotificationSettingsModal = ({
  isOpen,
  onClose,
  userProfileId,
}: {
  isOpen: boolean;
  onClose: () => void;
  userProfileId: string;
}) => {
  const [settings, setSettings] = useState<ProfileNotificationSettingsProps>({
    mainOption: "all",
    newPost: false,
    reply: false,
    share: false,
    targetProfileId: userProfileId,
  });

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

  const handleMainOptionChange = (
    option: ProfileNotificationSettingsProps["mainOption"],
  ) => {
    setSettings((prev) => ({
      ...prev,
      mainOption: option,
      ...(option === "specific" && !prev.newPost && !prev.reply && !prev.share
        ? { newPost: true }
        : {}),
      ...(option !== "specific" && {
        newPost: false,
        reply: false,
        share: false,
      }),
    }));
  };

  const handleSubOptionChange = (option: "newPost" | "reply" | "share") => {
    setSettings((prev) => {
      const newValue = !prev[option];
      if (!newValue && option === "newPost" && !prev.reply && !prev.share)
        return prev;
      if (!newValue && option === "reply" && !prev.newPost && !prev.share)
        return prev;
      if (!newValue && option === "share" && !prev.newPost && !prev.reply)
        return prev;

      return {
        ...prev,
        [option]: newValue,
      };
    });
  };

  const handleSaveChanges = async (
    settings: ProfileNotificationSettingsProps,
  ) => {
    const response = await fetch("/api/save-profile-notification-settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error("Failed to save notification settings");
    }

    onClose();
    return response.json();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-40 flex h-full w-full items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="w-[300px] rounded-xl border-2 border-darkBorder bg-black pt-2 transition duration-150 ease-in-out hover:border-darkBorderHover"
      >
        <h1 className="text-center font-semibold">
          Profile Notification Settings
        </h1>

        <div className="m-5">
          {/* TODO: Add profile info for which the notifications settings will apply */}
          <div></div>

          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                checked={settings.mainOption === "all"}
                onChange={() => handleMainOptionChange("all")}
                className="h-4 w-4 text-blue-600"
              />
              <span className="select-none">All notifications</span>
            </label>

            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  checked={settings.mainOption === "specific"}
                  onChange={() => handleMainOptionChange("specific")}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="select-none">Specific notifications</span>
              </label>

              {settings.mainOption === "specific" && (
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
                checked={settings.mainOption === "disable"}
                onChange={() => handleMainOptionChange("disable")}
                className="h-4 w-4 text-blue-600"
              />
              <span>Disable notifications</span>
            </label>
          </div>

          {/* TODO: Save the settings */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => handleSaveChanges(settings)}
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
