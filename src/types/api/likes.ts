export interface LikeActionParams {
  id: string;
  type: "post" | "comment";
}

export interface LikeResponse {
  success: boolean;
  likesCount: number;
  userLiked: boolean;
}

export interface LikesData {
  likesCount: number;
  userLiked: boolean;
}
