import { Post } from "@/types/post";
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

// Only show content from a specific user
export const useUserTimeline = () => {};
