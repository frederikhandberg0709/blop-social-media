import { getServerSession } from "next-auth";
import ResetPasswordForm from "./ResetPasswordForm";
import { redirect } from "next/navigation";
import ButtonLink from "@/components/buttons/ButtonLink";

export default async function ResetPasswordPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/home");
  }

  return (
    <div className="mt-[150px] flex w-full flex-col items-center justify-center">
      <div className="w-[400px]">
        <h1 className="text-center text-3xl font-semibold">Reset Password</h1>

        <div className="mt-10 flex flex-col items-center gap-0.5">
          <p className="text-center text-sm font-bold">
            Have you forgotten your password?
          </p>
          <p className="text-center text-sm opacity-75">
            Please enter your email or username below, then create and confirm
            your new password to reset it.
          </p>
        </div>

        <ResetPasswordForm />

        <div className="mt-20 flex flex-col items-center gap-8">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold">Back to Login?</h2>
            <p className="text-center text-sm opacity-75">
              Recalled your password?{" "}
              <span className="font-bold">Head back to login instead.</span>
            </p>
          </div>
          <ButtonLink href="/login" variant="primary_glow">
            Login
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
