import { useQueries } from "@tanstack/react-query";
import { Post } from "@/types/components/post";

interface UsePostsOptions {
  postIds: string[];
  enabled?: boolean;
}

interface UsePostsReturn {
  posts: (Post | undefined)[];
  isLoading: boolean;
  isError: boolean;
  errors: (Error | null)[];
}

export function usePosts({
  postIds,
  enabled = true,
}: UsePostsOptions): UsePostsReturn {
  const queryResults = useQueries({
    queries: postIds.map((id) => ({
      queryKey: ["post", id],
      queryFn: async () => {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch post ${id}`);
        }
        return response.json();
      },
      enabled: enabled && !!id,
    })),
  });

  return {
    posts: queryResults.map((result) => result.data),
    isLoading: queryResults.some((result) => result.isLoading),
    isError: queryResults.some((result) => result.isError),
    errors: queryResults.map((result) => result.error),
  };
}
