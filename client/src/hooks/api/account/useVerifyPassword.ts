import { useMutation } from "@tanstack/react-query";

interface VerifyPasswordParams {
  currentPassword: string;
}

export function useVerifyPassword() {
  return useMutation({
    mutationFn: async ({ currentPassword }: VerifyPasswordParams) => {
      const response = await fetch("/api/account/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify password");
      }

      return data.verified;
    },
  });
}
