import { UpdatePostResponse, UpdatePostParams } from "@/types/api/posts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation<UpdatePostResponse, Error, UpdatePostParams>({
    mutationFn: async ({ postId, title, content }: UpdatePostParams) => {
      const response = await fetch(`/api/update-post/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, title, content }),
      });
      if (!response.ok) throw new Error("Failed to update post");
      return response.json();
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts", postId, "history"] });
    },
  });
}
