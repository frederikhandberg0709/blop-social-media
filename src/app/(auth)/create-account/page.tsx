import { getServerSession } from "next-auth";
import RegistrationForm from "./RegistrationForm";
import Link from "next/link";
import { redirect } from "next/navigation";
import ButtonLink from "@/components/buttons/ButtonLink";

export default async function CreateAccountPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/home");
  }

  return (
    <div className="mt-[150px] flex w-full flex-col items-center justify-center">
      <div className="w-[400px]">
        <h1 className="text-center text-3xl font-semibold">Create Account</h1>

        <RegistrationForm />

        <div className="mt-20 flex flex-col items-center gap-8">
          <h2 className="text-[20px] font-semibold">
            Already have an account?
          </h2>
          <ButtonLink href="/login" variant="primary_glow">
            Login
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
