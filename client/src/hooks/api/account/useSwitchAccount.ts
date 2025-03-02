import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface LinkedUser {
  id: string;
  username: string;
  email: string;
  profileName?: string;
  profilePicture?: string;
  profileBanner?: string;
}

export function useSwitchAccount() {
  const queryClient = useQueryClient();
  const { update } = useSession();

  return useMutation({
    mutationFn: async (linkedAccountId: string): Promise<LinkedUser> => {
      console.log("Switching to account:", linkedAccountId);

      const response = await fetch(`/api/account/switch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ linkedAccountId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to switch account");
      }

      const linkedUser = await response.json();

      return linkedUser;
    },
    onSuccess: async (userData) => {
      await update({
        switchToUserId: userData.id,
      });

      queryClient.invalidateQueries();
    },
  });
}
