import { UserProps } from "./user";

export interface Comment {
  id: string;
  user: UserProps;
  createdAt: string;
  updatedAt: string;
  timestamp: string;
  title?: string;
  content: string | React.ReactNode;
  imageContent?: string;
  videoContent?: string;
  replies?: Comment[];
  initialLikesCount: number;
  userLiked: boolean;
}
