"use client";

import FloatingInput from "@/components/inputs/FloatingInput";
import { PasswordInput } from "@/components/inputs/PasswordInput";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <form>
      <div className="flex flex-col gap-6">
        <FloatingInput
          placeholder="Email or Username"
          name="email"
          value={identifier}
          onChange={handleIdentifierChange}
          disabled={isLoading}
          required
        />

        <PasswordInput
          placeholder="New Password"
          name="newPassword"
          value={newPassword}
          onChange={handleNewPasswordChange}
          disabled={isLoading}
        />

        <PasswordInput
          placeholder="Confirm New Password"
          name="confirmNewPassword"
          value={confirmNewPassword}
          onChange={handleConfirmNewPasswordChange}
          disabled={isLoading}
        />
      </div>
    </form>
  );
}
