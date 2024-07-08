import LoginForm from "./LoginForm";
import Link from "next/link";

const LogInPage = () => {
  return (
    <div className="mt-[150px] w-full flex flex-col items-center justify-center">
      <div className="w-fit">
        <h1 className="text-[30px] font-semibold text-center">Login</h1>

        <LoginForm />

        <div className="flex flex-col items-center gap-8 mt-20">
          <div className="text-center">
            <h2 className="font-semibold text-[20px] mb-2">
              Don{"'"}t already have an account?
            </h2>
            <p className="opacity-75">
              Create an account.{" "}
              <span className="font-bold">It{"'"}s free!</span>
            </p>
          </div>
          <Link
            href="/create-account"
            className="font-semibold text-blue-500 hover:text-white hover:bg-blue-600 relative bottom-0 hover:bottom-1 hover:shadow-[0_5px_40px_10px_rgb(37,99,235,0.5)] px-4 py-2 rounded-xl transition-all duration-150 ease-in-out"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
