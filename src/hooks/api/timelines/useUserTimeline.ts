import { Post } from "@/types/components/post";
import { useQuery } from "@tanstack/react-query";

interface TimelineResponse {
  posts: Post[];
  nextCursor?: string;
}

// Only show content from a specific user
export const useUserTimeline = () => {};
