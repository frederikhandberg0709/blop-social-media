import { getServerSession } from "next-auth";
import RegistrationForm from "./form";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CreateAccountPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="mt-[90px] w-full flex flex-col items-center justify-center">
      <div className="w-fit">
        <h1 className="text-[30px] font-semibold text-center">
          Create Account
        </h1>

        <RegistrationForm />
        <div>
          <p>Already have an account?</p>
          <Link
            href="/login"
            className="text-white bg-blue-600 relative bottom-0 hover:bottom-1 hover:shadow-[0_5px_40px_10px_rgb(37,99,235,0.5)] px-4 py-2 mt-[50px] rounded-xl transition-all duration-150 ease-in-out"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
