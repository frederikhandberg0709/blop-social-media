import { FollowParams } from "@/types/api/follow";

export const followKeys = {
  // For checking single follow status
  single: (params: FollowParams) => ["follow", params.userId] as const,

  // For listing who follows a user
  followers: (userId: string) => ["followers", userId] as const,

  // For listing who a user follows
  following: (userId: string) => ["following", userId] as const,

  all: () => ["follow"] as const,
};
