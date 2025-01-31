import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface CreatePostData {
  userId: string | undefined;
  title?: string;
  content: string;
  timestamp?: string;
}

interface QuotePostData extends CreatePostData {
  quotedPostId: string;
}

interface CreatePostResponse {
  success: boolean;
  postId: string;
}

export function useCreatePostMutation() {
  const session = useSession();

  return useMutation<CreatePostResponse, Error, CreatePostData | QuotePostData>(
    {
      mutationFn: async (postData: CreatePostData | QuotePostData) => {
        if (!session.data?.user?.id) {
          throw new Error("You need to be logged in to create posts");
        }

        const data = {
          ...postData,
          userId: session.data.user.id,
          timestamp: postData.timestamp || new Date().toISOString,
        };

        const response = await fetch("/api/create-post", {
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
    },
  );
}
