import LoginForm from "./LoginForm";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import ButtonLink from "@/components/buttons/ButtonLink";

export default async function LoginPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/home");
  }

  return (
    <div className="mt-[150px] flex w-full flex-col items-center justify-center">
      <div className="w-[400px]">
        <h1 className="text-center text-3xl font-semibold">Login</h1>

        <LoginForm />

        <div className="mt-20 flex flex-col items-center gap-8">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold">
              Don{"'"}t already have an account?
            </h2>
            <p className="opacity-75">
              Create an account.{" "}
              <span className="font-bold">It{"'"}s free!</span>
            </p>
          </div>
          <ButtonLink href="/create-account" variant="primary_glow">
            Create Account
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
