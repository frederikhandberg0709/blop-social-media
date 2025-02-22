import Button from "@/components/buttons/Button";
import UpdatePasswordDialog from "@/components/dialog/UpdatePasswordDialog";
import { useState } from "react";

const PasswordSecurity: React.FC = () => {
  const [isUpdatePasswordDialogOpen, setIsUpdatePasswordDialogOpen] =
    useState(false);

  const handleUpdatePasswordClick = () => {
    setIsUpdatePasswordDialogOpen(true);
  };

  const handleCancelUpdatePassword = () => {
    setIsUpdatePasswordDialogOpen(false);
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold">Password & Security</h1>
        <p className="mt-4">
          Password & Security Manage your account&apos;s security by updating
          your password. Choose a strong, unique password to keep your account
          safe.
        </p>

        <Button onClick={handleUpdatePasswordClick} className="mt-5">
          Change Password
        </Button>
      </div>

      <UpdatePasswordDialog
        isOpen={isUpdatePasswordDialogOpen}
        onClose={handleCancelUpdatePassword}
      />
    </>
  );
};

export default PasswordSecurity;
