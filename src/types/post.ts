import { UserProps } from "./user";

export interface BasePost {
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

export interface OriginalPost extends BasePost {
  type: "original";
}

export interface SharedPost extends BasePost {
  type: "shared";
  sharedBy: UserProps;
  sharedAt: string;
  originalPost: BasePost;
}

export type Post = OriginalPost | SharedPost;
