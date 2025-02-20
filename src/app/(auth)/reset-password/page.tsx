import { getServerSession } from "next-auth";
import ResetPasswordForm from "./ResetPasswordForm";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/home");
  }

  return (
    <div className="mt-[150px] flex w-full flex-col items-center justify-center">
      <div className="w-fit">
        <h1 className="text-center text-3xl font-semibold">Reset Password</h1>

        <ResetPasswordForm />
      </div>
    </div>
  );
}
