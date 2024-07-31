import { UserProps } from "./UserProps";

export interface CommentProps {
  id: string;
  //   profilePicture: string | null;
  //   profileName: string | null;
  //   username: string;
  user: UserProps;
  createdAt: string;
  updatedAt: string;
  timestamp: string;
  title?: string;
  content: string | React.ReactNode;
  imageContent?: string;
  videoContent?: string;
  replies?: CommentProps[];
  initialLikesCount: number;
  userLiked: boolean;
}
