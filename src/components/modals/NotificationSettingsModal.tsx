import { useEffect, useRef, useState } from "react";

interface NotificationSettings {
  mainOption: "all" | "specific" | "disable";
  newPost: boolean;
  reply: boolean;
}

const NotificationSettingsModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [settings, setSettings] = useState<NotificationSettings>({
    mainOption: "all",
    newPost: false,
    reply: false,
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
    option: NotificationSettings["mainOption"],
  ) => {
    setSettings((prev) => ({
      ...prev,
      mainOption: option,
      ...(option === "specific" && !prev.newPost && !prev.reply
        ? { newPost: true }
        : {}),
      ...(option !== "specific" && { newPost: false, reply: false }),
    }));
  };

  const handleSubOptionChange = (option: "newPost" | "reply") => {
    setSettings((prev) => {
      const newValue = !prev[option];
      if (!newValue && option === "newPost" && !prev.reply) return prev;
      if (!newValue && option === "reply" && !prev.newPost) return prev;

      return {
        ...prev,
        [option]: newValue,
      };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-40 flex h-full w-full items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="w-[300px] rounded-xl border-2 border-darkBorder bg-black pt-2 transition duration-150 ease-in-out hover:border-darkBorderHover"
      >
        <h1 className="text-center font-semibold">Notification Settings</h1>

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
                <div className="ml-7 space-y-3">
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
              onClick={onClose}
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

export default NotificationSettingsModal;
