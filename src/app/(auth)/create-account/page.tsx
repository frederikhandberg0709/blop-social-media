import { getServerSession } from "next-auth";
import RegistrationForm from "./RegistrationForm";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CreateAccountPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/home");
  }

  return (
    <div className="mt-[150px] flex w-full flex-col items-center justify-center">
      <div className="w-fit">
        <h1 className="text-center text-3xl font-semibold">Create Account</h1>

        <RegistrationForm />

        <div className="mt-20 flex flex-col items-center gap-8">
          <h2 className="text-[20px] font-semibold">
            Already have an account?
          </h2>
          <Link
            href="/login"
            className="relative bottom-0 rounded-xl px-4 py-2 font-semibold text-blue-500 transition-all duration-150 ease-in-out hover:bottom-1 hover:bg-blue-600 hover:text-white hover:shadow-[0_5px_40px_10px_rgb(37,99,235,0.5)]"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
