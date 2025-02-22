import { FollowParams } from "@/types/api/follow";

export const followKeys = {
  // For checking single follow status
  single: (params: FollowParams) => ["follow", params.userId] as const,

  // For listing who follows a user
  followers: (userId: string) => ["followers", userId] as const,

  // For getting the count of how many users follow a user
  followersCount: (userId: string) => ["followersCount", userId] as const,

  // For listing who a user follows
  following: (userId: string) => ["following", userId] as const,

  // For getting the count of how many users a user follows
  followingCount: (userId: string) => ["followingCount", userId] as const,

  all: () => ["follow"] as const,
};
