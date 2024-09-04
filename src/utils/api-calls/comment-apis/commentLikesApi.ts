import { useEffect, useState, useCallback } from "react";

interface CommentLikesData {
  likesCount: number;
  userLiked: boolean;
}

interface Session {
  user: {
    id: string;
  };
}

export const fetchCommentLikesCount = async (
  commentId: string,
  userId: string | undefined,
): Promise<CommentLikesData> => {
  const response = await fetch(
    `/api/likes-count-comment?commentId=${commentId}&userId=${userId}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch comment likes count");
  }
  return response.json();
};

export const likeComment = async (
  commentId: string,
  userId: string,
): Promise<void> => {
  const response = await fetch("/api/like-comment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ commentId, userId }),
  });
  if (!response.ok) {
    throw new Error("Failed to like comment");
  }
};

export const unlikeComment = async (
  commentId: string,
  userId: string,
): Promise<void> => {
  const response = await fetch("/api/unlike-comment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ commentId, userId }),
  });
  if (!response.ok) {
    throw new Error("Failed to unlike comment");
  }
};

export const useCommentLikesCount = (
  commentId: string,
  session: Session | null,
) => {
  const [likesData, setLikesData] = useState<CommentLikesData>({
    likesCount: 0,
    userLiked: false,
  });

  const fetchData = useCallback(async () => {
    if (session?.user?.id) {
      try {
        const data = await fetchCommentLikesCount(commentId, session.user.id);
        setLikesData(data);
      } catch (error) {
        console.error("Error fetching comment likes count:", error);
      }
    }
  }, [commentId, session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLike = useCallback(async () => {
    if (!session) {
      alert("You need to be logged in to like comments");
      return;
    }

    try {
      await likeComment(commentId, session.user.id);
      setLikesData((prev) => ({
        likesCount: prev.likesCount + 1,
        userLiked: true,
      }));
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  }, [commentId, session]);

  const handleUnlike = useCallback(async () => {
    if (!session) {
      alert("You need to be logged in to unlike comments");
      return;
    }

    try {
      await unlikeComment(commentId, session.user.id);
      setLikesData((prev) => ({
        likesCount: prev.likesCount - 1,
        userLiked: false,
      }));
    } catch (error) {
      console.error("Failed to unlike comment:", error);
    }
  }, [commentId, session]);

  return {
    ...likesData,
    handleLike,
    handleUnlike,
    refetch: fetchData,
  };
};
