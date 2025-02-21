import { useMutation } from "@tanstack/react-query";

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async ({
      identifier,
      currentPassword,
      newPassword,
    }: {
      identifier?: string;
      currentPassword: string;
      newPassword: string;
    }) => {
      const response = await fetch("/api/account/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, currentPassword, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      return data;
    },
  });
}
