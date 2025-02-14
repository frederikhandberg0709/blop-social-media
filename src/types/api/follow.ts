export interface FollowParams {
  userId: string;
}

export interface FollowResponse {
  createdAt: Date;
  followerId: string;
  followingId: string;
}

export interface FollowingUser {
  id: string;
  username: string;
  profileName: string;
  profilePicture: string | null;
}
