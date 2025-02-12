import { BookmarkParams, BookmarkStatus } from "@/types/api/bookmarks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { bookmarkKeys } from "./bookmarkKeys";

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
        throw new Error("You need to be logged in to delete bookmarks");
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
        queryKey: bookmarkKeys.status({ type, id }),
      });

      const previousData = queryClient.getQueryData<BookmarkStatus>([
        "bookmark",
        type,
        id,
      ]);

      queryClient.setQueryData<BookmarkStatus>(
        bookmarkKeys.status({ type, id }),
        {
          isBookmarked: false,
          bookmarkId: null,
        },
      );

      return { previousData };
    },

    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          bookmarkKeys.status({ type: variables.type, id: variables.id }),
          context.previousData,
        );
      }
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: bookmarkKeys.status({
          type: variables.type,
          id: variables.id,
        }),
      });
      queryClient.invalidateQueries({
        queryKey: bookmarkKeys.all(),
      });
    },
  });
}
