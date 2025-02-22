import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useUser = () => {
  const session = useSession();

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      if (!session?.data?.user) {
        return null;
      }

      const response = await fetch(`/api/users/${session?.data?.user?.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      return response.json();
    },
  });
};
