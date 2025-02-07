import { Post } from "@/types/post";
import { useQuery } from "@tanstack/react-query";

interface TimelineResponse {
  posts: Post[];
  nextCursor?: string;
}

// Only show content from users the logged-in user is following
export const useFollowingTimeline = () => {
  return useQuery<TimelineResponse, Error>({
    queryKey: ["timeline", "following"],
    queryFn: async () => {
      const response = await fetch("/api/timeline/following");
      if (!response.ok) throw new Error("Failed to fetch timeline");
      return response.json();
    },
  });
};
