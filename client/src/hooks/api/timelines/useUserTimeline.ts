import { Post } from "@/types/components/post";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

interface TimelineResponse {
  posts: Post[];
  initialCursor?: string;
}

interface UseUserTimelineParams {
  userId: string;
  initialCursor?: string;
}

// Only show content from a specific user
export const useUserTimeline = ({
  userId,
  initialCursor,
}: UseUserTimelineParams) => {
  return useInfiniteQuery<TimelineResponse>({
    queryKey: ["timeline", "user", userId],
    queryFn: async ({ pageParam = initialCursor }) => {
      const response = await fetch(
        `/api/users/${userId}/timeline${pageParam ? `?cursor=${pageParam}` : ""}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user timeline");
      }

      return response.json();
    },
    initialPageParam: initialCursor,
    getNextPageParam: (lastPage) => lastPage.initialCursor,
  });
};
