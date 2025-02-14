import {
  CreatePostParams,
  PostResponse,
  QuotePostParams,
} from "@/types/api/posts";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useCreatePost() {
  const session = useSession();

  return useMutation<PostResponse, Error, CreatePostParams | QuotePostParams>({
    mutationFn: async (postData: CreatePostParams | QuotePostParams) => {
      if (!session.data?.user?.id) {
        throw new Error("You need to be logged in to create posts");
      }

      const data = {
        ...postData,
        userId: session.data.user.id,
        timestamp: postData.timestamp || new Date().toISOString(),
      };

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create post");
      }

      return response.json();
    },

    onError: (error) => {
      console.error("Error creating post:", error);
    },
  });
}
