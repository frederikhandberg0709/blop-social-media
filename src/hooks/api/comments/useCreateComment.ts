import { CommentsResponse, CreateCommentParams } from "@/types/api/comments";
import { CommentProps } from "@/types/components/comment";
import { UserProps } from "@/types/components/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useCreateComment() {
  const session = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      parentId,
      title,
      content,
    }: CreateCommentParams) => {
      if (!session.data?.user?.id) {
        throw new Error("You need to be logged in to publish a comment");
      }

      const response = await fetch(`/api/send-comment/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentId,
          title,
          content,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to publish comment");
      }

      return response.json();
    },

    onMutate: async (newComment: CreateCommentParams) => {
      const queryKey = ["comments", newComment.postId];
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<CommentsResponse>(queryKey);

      const user: UserProps = {
        id: session.data?.user?.id ?? "",
        username: session.data?.user?.username ?? "",
        profileName: session.data?.user?.profileName || null,
        profilePicture: session.data?.user?.profilePicture || null,
        profileBanner: session.data?.user?.profileBanner,
        bio: "",
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
      };

      const optimisticComment: CommentProps = {
        id: `temp-${Date.now()}`,
        user,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        title: newComment.title,
        content: newComment.content,
        replies: [],
        initialLikesCount: 0,
        userLiked: false,
      };

      queryClient.setQueryData<CommentsResponse>(queryKey, {
        comments: [...(previousData?.comments || []), optimisticComment],
      });

      return { previousData };
    },

    onError: (error, newComment, context) => {
      queryClient.setQueryData(
        ["comments", newComment.postId],
        context?.previousData,
      );
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
    },
  });
}
