import { useUpdateEmail } from "@/hooks/api/account/useUpdateEmail";
import Button from "../buttons/Button";
import { Dialog } from "../dialog/Dialog";
import FloatingInput from "../inputs/FloatingInput";
import { useUser } from "@/hooks/api/users/useUser";
import { useState } from "react";
import { validateEmail } from "@/utils/accountValidation";
import { PasswordInput } from "../inputs/PasswordInput";

export default function UpdateEmailDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const updateEmailMutation = useUpdateEmail();

  const handleNewEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmail(e.target.value);
    setError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError("");
  };

  const { data: user } = useUser();

  const handleUpdateEmail = async () => {
    setError("");
    setSuccessMessage("");

    if (!newEmail) {
      setError("New email is required");
      return;
    }

    if (!validateEmail(newEmail)) {
      setError("Invalid email address");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      await updateEmailMutation.mutateAsync({
        email: newEmail,
        password,
      });

      setSuccessMessage("Email updated successfully");

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update email");
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Change Email
        </h2>

        <div className="mt-4 flex flex-col gap-4">
          <FloatingInput
            placeholder="New Email"
            value={newEmail}
            onChange={handleNewEmailChange}
          />
          <PasswordInput
            name="password"
            placeholder="Passowrd"
            value={password}
            onChange={handlePasswordChange}
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
            onClick={handleUpdateEmail}
            disabled={
              updateEmailMutation.isPending ||
              !newEmail ||
              !password ||
              newEmail === user.email ||
              !newEmail.includes("@")
            }
          >
            Update Email
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
