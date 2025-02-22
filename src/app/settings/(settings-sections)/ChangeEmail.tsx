import Button from "@/components/buttons/Button";
import UpdateEmailDialog from "@/components/dialog/UpdateEmailDialog";
import { useUser } from "@/hooks/api/users/useUser";
import { useState } from "react";

const ChangeEmail: React.FC = () => {
  const [isUpdateEmailDialogOpen, setIsUpdateEmailDialogOpen] = useState(false);

  const { data: user } = useUser();

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold">Change Email</h1>

        <p className="mt-4">
          Here you can update your email address. Your new email address will be
          used for logging in.
        </p>

        <div className="mt-4">
          <p className="text-sm text-white/50">Your Current Email</p>
          <p className="text-[18px] font-semibold">{user?.email}</p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsUpdateEmailDialogOpen(true)}
          className="mt-4"
        >
          Change Email
        </Button>
      </div>

      <UpdateEmailDialog
        isOpen={isUpdateEmailDialogOpen}
        onClose={() => setIsUpdateEmailDialogOpen(false)}
      />
    </>
  );
};

export default ChangeEmail;
