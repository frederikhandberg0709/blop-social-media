import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const useDeleteAccount = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/account", {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete account");
      }

      return response.json();
    },
    onSuccess: async () => {
      await signOut({ redirect: false });

      router.push("/home");

      localStorage.clear();
    },
    onError: (error) => {
      console.error("Error deleting account:", error);
    },
  });
};
