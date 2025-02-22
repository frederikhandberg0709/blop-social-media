import { useMutation } from "@tanstack/react-query";

// For resetting a user's password who is not logged in

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({
      identifier,
      newPassword,
    }: {
      identifier: string;
      newPassword: string;
    }) => {
      const response = await fetch("/api/account/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      return data;
    },
  });
};
