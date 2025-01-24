export interface ProfileNotificationSettingsProps {
  mainOption: "all" | "specific" | "disable";
  newPost: boolean;
  reply: boolean;
  share: boolean;
  targetProfileId: string;
}
