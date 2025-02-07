import { useQuery } from "@tanstack/react-query";

export function usePost({ postId }: { postId: string }) {
  return useQuery({
    queryKey: ["posts", postId],
    queryFn: async () => {
      const response = await fetch(`/api/fetch-post/${postId}`);
      if (!response.ok) throw new Error("Failed to fetch post");
      return response.json();
    },
    enabled: !!postId,
  });
}
