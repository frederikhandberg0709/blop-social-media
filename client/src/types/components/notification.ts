export enum NotificationTypes {
  NEW_POST = "NEW_POST",
  REPLY = "REPLY",
}

export enum NotificationSettingType {
  ALL = "ALL",
  SPECIFIC = "SPECIFIC",
  DISABLE = "DISABLE",
}

export interface ProfileNotificationSettingsProps {
  mainOption: NotificationSettingType;
  newPost: boolean;
  reply: boolean;
  share: boolean;
  targetProfileId: string;
}

export interface Notification {
  id: string;
  userId: string;
  fromUserId: string;
  fromUser: {
    username: string;
    profileName: string;
    profilePicture: string;
  };
  notificationType: NotificationTypes;
  content: string;
  isRead: boolean;
  createdAt: string;
  viewedAt: string | null;
  metaData: any | null;
}
