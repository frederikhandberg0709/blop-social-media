import { Post } from "@/types/components/post";
import { useQuery } from "@tanstack/react-query";

interface TimelineResponse {
  posts: Post[];
  nextCursor?: string;
}

// Show content from all users
export const useDiscoverTimeline = () => {
  return useQuery<TimelineResponse, Error>({
    queryKey: ["timeline", "discover"],
    queryFn: async () => {
      const response = await fetch("/api/timeline/discover");
      if (!response.ok) throw new Error("Failed to fetch timeline");
      return response.json();
    },
  });
};
