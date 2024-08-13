import { UserProps } from "./UserProps";

export interface BasePostProps {
  id: string;
  user: UserProps;
  createdAt: string;
  updatedAt: string;
  timestamp: string;
  title?: string;
  content: string;
  initialLikesCount: number;
  userLiked: boolean;
}

export interface OriginalPostProps extends BasePostProps {
  type: "original";
}

export interface SharedPostProps extends BasePostProps {
  type: "shared";
  sharedBy: UserProps;
  sharedAt: string;
  post: BasePostProps;
}

export type PostProps = OriginalPostProps | SharedPostProps;
