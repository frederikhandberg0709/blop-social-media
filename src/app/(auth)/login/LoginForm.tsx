"use client";

import { signIn } from "next-auth/react";
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
      className="flex flex-col items-center mt-[50px]"
    >
      <input
        type="text"
        name="email"
        placeholder="Email or Username"
        required
        className="mt-[20px] px-[20px] py-[12px] w-[400px] rounded-xl text-white bg-white/10 hover:bg-white/20 focus:bg-white/20 transition duration-200 ease-in-out outline-none"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        className="mt-[20px] px-[20px] py-[12px] w-[400px] rounded-xl text-white bg-white/10 hover:bg-white/20 focus:bg-white/20 transition duration-200 ease-in-out outline-none"
      />
      <button
        type="submit"
        className="font-semibold text-white bg-blue-600 relative bottom-0 hover:bottom-1 hover:shadow-[0_5px_40px_10px_rgb(37,99,235,0.5)] px-4 py-2 mt-[50px] rounded-xl transition-all duration-150 ease-in-out"
      >
        Login
      </button>
    </form>
  );
}
