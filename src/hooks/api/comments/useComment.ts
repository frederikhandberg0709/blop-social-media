import { useQuery } from "@tanstack/react-query";

export function useComment(commentId: string) {
  return useQuery({
    queryKey: ["comment", commentId],
    queryFn: async () => {
      const response = await fetch(`/api/fetch-comment/${commentId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error || `Error fetching comment: ${response.statusText}`,
        );
      }

      return response.json();
    },
    enabled: Boolean(commentId),
  });
}
