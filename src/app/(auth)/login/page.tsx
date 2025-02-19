import LoginForm from "./LoginForm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function LoginPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/home");
  }

  return (
    <div className="mt-[150px] flex w-full flex-col items-center justify-center">
      <div className="w-fit">
        <h1 className="text-center text-3xl font-semibold">Login</h1>

        <LoginForm />

        <div className="mt-20 flex flex-col items-center gap-8">
          <div className="text-center">
            <h2 className="mb-2 text-[20px] font-semibold">
              Don{"'"}t already have an account?
            </h2>
            <p className="opacity-75">
              Create an account.{" "}
              <span className="font-bold">It{"'"}s free!</span>
            </p>
          </div>
          <Link
            href="/create-account"
            className="relative bottom-0 rounded-xl px-4 py-2 font-semibold text-blue-500 transition-all duration-150 ease-in-out hover:bottom-1 hover:bg-blue-600 hover:text-white hover:shadow-[0_5px_40px_10px_rgb(37,99,235,0.5)]"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
