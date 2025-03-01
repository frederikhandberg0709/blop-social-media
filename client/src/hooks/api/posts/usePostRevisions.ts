import { useQuery } from "@tanstack/react-query";

export function usePostRevisions({ postId }: { postId: string }) {
  return useQuery({
    queryKey: ["postRevisions", postId],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${postId}/revisions`);
      if (!response.ok) throw new Error("Failed to fetch post revisions");
      return response.json();
    },
    enabled: !!postId,
  });
}
