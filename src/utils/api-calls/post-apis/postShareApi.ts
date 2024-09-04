import { useState, useCallback } from "react";

interface ShareData {
  sharesCount: number;
  userHasShared: boolean;
  shareId?: string;
}

interface Session {
  user: {
    id: string;
  };
}

export const sharePost = async (postId: string): Promise<void> => {
  const response = await fetch("/api/share-post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId }),
  });
  if (!response.ok) {
    throw new Error("Failed to share post");
  }
};

export const unsharePost = async (shareId: string): Promise<void> => {
  const response = await fetch("/api/unshare-post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shareId }),
  });
  if (!response.ok) {
    throw new Error("Failed to unshare post");
  }
};

export const usePostShare = (
  initialShareData: ShareData,
  session: Session | null,
) => {
  const [shareData, setShareData] = useState<ShareData>(initialShareData);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleShare = useCallback(
    async (postId: string) => {
      if (!session) {
        alert("You need to be logged in to share posts");
        return;
      }

      try {
        await sharePost(postId);
        alert("Post shared successfully!");
        setShareData((prev) => ({
          ...prev,
          sharesCount: prev.sharesCount + 1,
          userHasShared: true,
        }));
        setIsShareMenuOpen(false);
      } catch (error) {
        console.error("Error sharing post:", error);
      }
    },
    [session],
  );

  const handleUnshare = useCallback(async () => {
    if (!session || !shareData.userHasShared || !shareData.shareId) return;

    try {
      await unsharePost(shareData.shareId);
      setShareData((prev) => ({
        ...prev,
        sharesCount: prev.sharesCount - 1,
        userHasShared: false,
      }));
      setIsShareMenuOpen(false);
      setIsDeleted(true);
    } catch (error) {
      console.error("Error unsharing post:", error);
    }
  }, [session, shareData.userHasShared, shareData.shareId]);

  return {
    ...shareData,
    isShareMenuOpen,
    isDeleted,
    handleShare,
    handleUnshare,
    setIsShareMenuOpen,
  };
};
