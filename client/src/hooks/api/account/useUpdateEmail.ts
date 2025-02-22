import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await fetch("/api/account/update-email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update email");
      }

      return data.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], (oldUser: any) => ({
        ...oldUser,
        email: user.email,
      }));
    },
  });
};
