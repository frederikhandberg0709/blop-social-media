import { LikeActionParams } from "@/types/api/likes";

export const likeKeys = {
  single: ({ type, id }: LikeActionParams) => ["likes", type, id] as const,
};
