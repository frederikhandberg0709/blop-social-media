import { LikeParams } from "@/types/api/likes";

export const likeKeys = {
  single: ({ type, id }: LikeParams) => ["likes", type, id] as const,
};
