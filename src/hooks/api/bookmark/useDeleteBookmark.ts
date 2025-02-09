import { BookmarkParams, BookmarkStatus } from "@/types/api/bookmarks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface DeleteBookmarkParams {
  bookmarkId: string;
  type: "post" | "comment";
  id: string;
}

interface DeleteBookmarkContext {
  previousData: BookmarkStatus | undefined;
}

export function useDeleteBookmark() {
  const session = useSession();
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteBookmarkParams, DeleteBookmarkContext>({
    mutationFn: async ({ bookmarkId }) => {
      if (!session.data?.user?.id) {
        throw new Error(`You need to be logged in to delete bookmarks`);
      }

      const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete bookmark");
      }
    },

    onMutate: async ({ type, id }) => {
      await queryClient.cancelQueries({
        queryKey: ["bookmark", type, id],
      });

      const previousData = queryClient.getQueryData<BookmarkStatus>([
        "bookmark",
        type,
        id,
      ]);

      queryClient.setQueryData<BookmarkStatus>(["bookmark", type, id], {
        isBookmarked: false,
        bookmarkId: null,
      });

      return { previousData };
    },

    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["bookmark", variables.type, variables.id],
          context.previousData,
        );
      }
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["bookmark", variables.type, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["bookmarks"],
      });
    },
  });
}
