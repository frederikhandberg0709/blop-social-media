import Button from "@/components/buttons/Button";
import DeleteConfirmationDialog from "@/components/dialog/DeleteConfirmationDialog";
import { useDeleteAccount } from "@/hooks/api/account/useDeleteAccount";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

const DeleteAccount: React.FC = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteAccountMutation = useDeleteAccount();

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteAccountMutation.mutate();
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 transition duration-150 ease-in-out hover:border-red-500/30 hover:bg-red-500/10">
        <h1 className="text-3xl font-bold">Delete Account</h1>
        <div className="mt-4 flex items-center justify-start gap-2">
          <AlertTriangle className="h-6 w-6 flex-shrink-0 text-red-500" />
          <p className="font-semibold text-red-500">
            Warning: Deleting your account is a permanent action and cannot be
            undone.
          </p>
        </div>
        <p className="mt-2.5 text-gray-800 dark:text-gray-200">
          All your data, including your profile, posts, and settings, will be
          permanently deleted.
          <br />
          <br />
          If you are sure you want to delete your account, please proceed with
          caution.
        </p>

        <Button variant="danger" onClick={handleDeleteClick} className="mt-5">
          Delete My Account
        </Button>

        {deleteAccountMutation.isError && (
          <p className="mt-2 text-sm text-red-500">
            {deleteAccountMutation.error.message ||
              "Something went wrong. Please try again."}
          </p>
        )}
      </div>

      <DeleteConfirmationDialog
        title="Delete Account"
        text="This action cannot be undone. This will permanently delete your account
            and remove all your data from our servers."
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isLoading={deleteAccountMutation.isPending}
      />
    </>
  );
};

export default DeleteAccount;
