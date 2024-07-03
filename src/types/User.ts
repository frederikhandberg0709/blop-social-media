export interface User {
  id: string;
  username: string;
  profileName?: string;
  profilePicture?: string;
  profileBanner?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}
