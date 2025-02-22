import { formatDate } from "./formattedDate";

export function getTimestamp(createdAt: string, updatedAt?: string): string {
  return updatedAt ? formatDate(updatedAt) : formatDate(createdAt);
}
