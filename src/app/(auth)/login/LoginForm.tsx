"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function LoginForm() {
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const response = await signIn("credentials", {
      identifier: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    console.log({ response });
    if (!response?.error) {
      router.push("/home");
      router.refresh();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-[50px] flex flex-col items-center"
    >
      <input
        type="text"
        name="email"
        placeholder="Email or Username"
        required
        className="mt-[20px] w-[400px] rounded-xl bg-black/10 px-[20px] py-[12px] text-black outline-none transition duration-200 ease-in-out hover:bg-black/20 focus:bg-black/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:focus:bg-white/20"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        className="mt-[20px] w-[400px] rounded-xl bg-black/10 px-[20px] py-[12px] text-black outline-none transition duration-200 ease-in-out hover:bg-black/20 focus:bg-black/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:focus:bg-white/20"
      />
      <div className="mt-2 w-full text-end">
        <Link
          href={"#"}
          className="text-[13px] font-semibold hover:text-blue-500"
        >
          Forgot password?
        </Link>
      </div>
      <button
        type="submit"
        className="relative bottom-0 mt-[40px] rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition-all duration-150 ease-in-out hover:bottom-1 hover:shadow-[0_5px_40px_10px_rgb(37,99,235,0.5)]"
      >
        Login
      </button>
    </form>
  );
}
