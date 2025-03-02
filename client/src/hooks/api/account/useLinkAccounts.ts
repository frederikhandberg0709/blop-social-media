import { useMutation, useQueryClient } from "@tanstack/react-query";

interface LinkAccountsData {
  currentUserId: string;
  linkedUserId: string;
}

interface LinkAccountsResponse {
  success: boolean;
  message: string;
  linkedAccount?: {
    id: string;
    userId: string;
    linkedUserId: string;
    createdAt: string;
  };
}

export function useLinkAccounts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: LinkAccountsData,
    ): Promise<LinkAccountsResponse> => {
      const response = await fetch("/api/account/linked", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to link accounts");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["linkedAccounts"] });
    },
  });
}
