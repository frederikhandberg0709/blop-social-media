export interface UserProps {
  id: string;
  username: string;
  profileName: string | null;
  profilePicture: string | null;
  profileBanner?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}
