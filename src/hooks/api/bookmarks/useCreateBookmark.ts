import { BookmarkParams, BookmarkStatus } from "@/types/api/bookmarks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface CreateBookmarkResponse {
  id: string;
}

export function useCreateBookmark() {
  const session = useSession();
  const queryClient = useQueryClient();

  return useMutation<CreateBookmarkResponse, Error, BookmarkParams>({
    mutationFn: async ({ type, id }: BookmarkParams) => {
      if (!session.data?.user?.id) {
        throw new Error(`You need to be logged in to create bookmarks`);
      }

      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [type === "post" ? "postId" : "commentId"]: id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create bookmark");
      }

      return response.json();
    },

    onMutate: async ({ type, id }) => {
      await queryClient.cancelQueries({ queryKey: ["bookmark", type, id] });

      const previousData = queryClient.getQueryData<BookmarkStatus>([
        "bookmark",
        type,
        id,
      ]);

      queryClient.setQueryData<BookmarkStatus>(["bookmark", type, id], {
        isBookmarked: true,
        bookmarkId: "temp-id",
      });

      return { previousData };
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["bookmark", variables.type, variables.id],
      });

      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}
