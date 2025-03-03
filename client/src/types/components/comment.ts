import { UserProps } from "./user";

export interface CommentProps {
  id: string;
  user: UserProps;
  createdAt: string;
  updatedAt?: string;
  timestamp: string;
  title?: string;
  content: string | React.ReactNode;
  imageContent?: string;
  videoContent?: string;
  initialLikesCount: number;
  userLiked: boolean;
  replies?: CommentProps[];
  children?: CommentProps[];
}
