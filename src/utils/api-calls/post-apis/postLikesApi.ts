import { useEffect, useState, useCallback } from "react";

interface LikesData {
  likesCount: number;
  userLiked: boolean;
}

interface Session {
  user: {
    id: string;
  };
}

export const fetchLikesCount = async (
  postId: string,
  userId: string | undefined,
): Promise<LikesData> => {
  try {
    const response = await fetch(
      `/api/likes-count-post?postId=${postId}&userId=${userId}`,
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching likes count:", error);
    return { likesCount: 0, userLiked: false };
  }
};

const likePost = async (postId: string, userId: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/like-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, userId }),
    });
    return response.ok;
  } catch (error) {
    console.error("Error liking post:", error);
    return false;
  }
};

const unlikePost = async (postId: string, userId: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/unlike-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, userId }),
    });
    return response.ok;
  } catch (error) {
    console.error("Error unliking post:", error);
    return false;
  }
};

export const useLikesCount = (postId: string, session: Session | null) => {
  const [likesData, setLikesData] = useState<LikesData>({
    likesCount: 0,
    userLiked: false,
  });

  const fetchData = useCallback(async () => {
    if (session?.user?.id) {
      const data = await fetchLikesCount(postId, session.user.id);
      setLikesData(data);
    }
  }, [postId, session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLike = useCallback(async () => {
    if (!session) {
      alert("You need to be logged in to like posts");
      return;
    }

    const success = await likePost(postId, session.user.id);
    if (success) {
      setLikesData((prev) => ({
        likesCount: prev.likesCount + 1,
        userLiked: true,
      }));
    } else {
      console.error("Failed to like post");
    }
  }, [postId, session]);

  const handleUnlike = useCallback(async () => {
    if (!session) {
      alert("You need to be logged in to unlike posts");
      return;
    }

    const success = await unlikePost(postId, session.user.id);
    if (success) {
      setLikesData((prev) => ({
        likesCount: prev.likesCount - 1,
        userLiked: false,
      }));
    } else {
      console.error("Failed to unlike post");
    }
  }, [postId, session]);

  return {
    ...likesData,
    handleLike,
    handleUnlike,
    refetch: fetchData,
  };
};
