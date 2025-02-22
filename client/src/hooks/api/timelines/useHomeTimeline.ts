import { Post } from "@/types/components/post";
import { useQuery } from "@tanstack/react-query";

interface TimelineResponse {
  posts: Post[];
  nextCursor?: string;
}

// Show a combination of content from users the logged-in user is following and not following
export const useHomeTimeline = () => {
  return useQuery<TimelineResponse, Error>({
    queryKey: ["timeline", "home"],
    queryFn: async () => {
      const response = await fetch("/api/timeline/home");
      if (!response.ok) throw new Error("Failed to fetch timeline");
      return response.json();
    },
  });
};
