import { ShareParams } from "@/types/api/shares";

export const shareKeys = {
  single: ({ type, id }: ShareParams) => ["shares", type, id] as const,
  status: ({ type, id }: ShareParams, userId: string) =>
    ["shares", "status", type, id, userId] as const,
  count: ({ type, id }: ShareParams) => ["shares", "count", type, id] as const,
};
