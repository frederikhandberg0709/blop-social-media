import { UserProps } from "./UserProps";

export interface PostProps {
  id: string;
  user: UserProps;
  title?: string;
  content: string | React.ReactNode;
  imageContent?: string;
  videoContent?: string;
  initialLikesCount: number;
  userLiked: boolean;
  createdAt: string;
  updatedAt: string;
  timestamp: string;
}
