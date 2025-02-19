import { UserProps } from "@/types/components/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useUpdateProfile = () => {
  const { data: session, update } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedFields: Partial<UserProps>) => {
      const response = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      return response.json();
    },
    onSuccess: async (updatedUser, variables) => {
      queryClient.setQueryData(
        ["user", session?.user?.id],
        (oldData: UserProps | undefined) => {
          return oldData ? { ...oldData, ...updatedUser } : updatedUser;
        },
      );

      if (session) {
        await update({
          ...session,
          user: {
            ...session.user,
            ...variables,
          },
        });
      }
    },
  });
};
