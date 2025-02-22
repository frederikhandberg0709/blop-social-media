import { useState } from "react";
import { PasswordInput } from "../inputs/PasswordInput";
import { Dialog } from "./Dialog";
import Button from "../buttons/Button";
import { useVerifyPassword } from "@/hooks/api/account/useVerifyPassword";
import { useUpdatePassword } from "@/hooks/api/account/useUpdatePassword";
import { passwordsMatch, validatePassword } from "@/utils/accountValidation";

interface UpdatePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdatePasswordDialog({
  isOpen,
  onClose,
}: UpdatePasswordDialogProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const verifyPasswordMutation = useVerifyPassword();
  const updatePasswordMutation = useUpdatePassword();

  const handleCurrentPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCurrentPassword(e.target.value);
    setError("");
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setError("");
  };

  const handleConfirmNewPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setConfirmNewPassword(value);
    if (newPassword !== value) {
      setError("Passwords do not match.");
    } else {
      setError("");
    }
  };

  const handleUpdatePassword = async () => {
    setError("");
    setSuccessMessage("");

    if (!currentPassword) {
      setError("Current password is required");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError(
        "New password must be at least 8 characters long and contain at least one special character",
      );
      return;
    }

    if (!passwordsMatch(newPassword, confirmNewPassword)) {
      setError("Passwords do not match");
      return;
    }

    try {
      const isVerified = await verifyPasswordMutation.mutateAsync({
        currentPassword,
      });

      if (!isVerified) {
        setError("Current password is incorrect");
        return;
      }

      await updatePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
      });

      setSuccessMessage("Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update password",
      );
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Update Password
        </h2>

        <div className="mt-4 flex flex-col gap-4">
          <PasswordInput
            name="currentPassword"
            value={currentPassword}
            onChange={handleCurrentPasswordChange}
            placeholder="Current Password"
          />
          <PasswordInput
            name="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            placeholder="New Password"
          />
          <PasswordInput
            name="confirmPassword"
            value={confirmNewPassword}
            onChange={handleConfirmNewPasswordChange}
            placeholder="Confirm New Password"
          />
        </div>

        <div className="my-2.5">
          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <Button variant="danger" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleUpdatePassword}
            disabled={
              updatePasswordMutation.isPending ||
              !currentPassword ||
              !newPassword ||
              !confirmNewPassword
            }
          >
            Update Password
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
