"use client";

import Button from "@/components/buttons/Button";
import FloatingInput from "@/components/inputs/FloatingInput";
import { PasswordInput } from "@/components/inputs/PasswordInput";
import { useUpdatePassword } from "@/hooks/api/account/useUpdatePassword";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const updatePassword = useUpdatePassword();

  const areFieldsEmpty = [identifier, newPassword, confirmNewPassword].some(
    (field) => field.trim() === "",
  );

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentifier(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setError("");
  };

  const handleConfirmNewPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmNewPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // TODO: Make sure passwords follow requirements
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await updatePassword.mutateAsync({
        identifier,
        currentPassword: "",
        newPassword,
      });

      setSuccessMessage("Password updated successfully!");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    }
  };

  return (
    <form className="mt-5 flex flex-col items-center">
      <div className="flex flex-col items-center gap-6">
        <FloatingInput
          placeholder="Email or Username"
          name="email"
          value={identifier}
          onChange={handleIdentifierChange}
          disabled={updatePassword.isPending}
          required
        />

        <PasswordInput
          placeholder="New Password"
          name="newPassword"
          value={newPassword}
          onChange={handleNewPasswordChange}
          disabled={updatePassword.isPending}
        />

        <PasswordInput
          placeholder="Confirm New Password"
          name="confirmNewPassword"
          value={confirmNewPassword}
          onChange={handleConfirmNewPasswordChange}
          disabled={updatePassword.isPending}
        />
      </div>

      <div className={"mt-3"}>
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
      </div>

      <Button
        type="submit"
        variant="primary_glow"
        onClick={handleSubmit}
        disabled={!!error || areFieldsEmpty || updatePassword.isPending}
        className={`mt-8 bg-blue-600 text-white ${!!error || areFieldsEmpty || updatePassword.isPending ? "cursor-not-allowed opacity-50 hover:bottom-0 hover:shadow-none" : "opacity-100 hover:bottom-1 hover:shadow-[0_5px_40px_10px_rgb(37,99,235,0.5)]"}`}
      >
        {updatePassword.isPending ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );
}
