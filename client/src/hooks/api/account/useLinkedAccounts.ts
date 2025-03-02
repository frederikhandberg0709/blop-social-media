import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface LinkedAccount {
  id: string;
  username: string;
  profileName?: string;
  profilePicture?: string;
}

export function useLinkedAccounts() {
  const { data: session, status } = useSession();

  const result = useQuery({
    queryKey: ["linkedAccounts", session?.user?.id],
    queryFn: async (): Promise<LinkedAccount[]> => {
      if (!session?.user?.id) {
        return [];
      }

      const response = await fetch("/api/account/linked");

      if (!response.ok) {
        throw new Error("Failed to fetch linked accounts");
      }

      return response.json();
    },
    enabled: status === "authenticated" && !!session?.user?.id,
  });

  return {
    linkedAccounts: result.data || [],
    isPending: result.isPending,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}
