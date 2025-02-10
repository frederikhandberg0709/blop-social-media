export interface FollowParams {
  userId: string;
}

export interface FollowResponse {
  createdAt: Date;
  followerId: string;
  followingId: string;
}
