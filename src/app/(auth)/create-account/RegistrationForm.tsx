"use client";

import { FormEvent } from "react";

export default function RegistrationForm() {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        username: formData.get("username"),
        password: formData.get("password"),
      }),
    });

    console.log({ response });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center mt-[50px]"
    >
      <input
        type="text"
        name="email"
        placeholder="Email"
        className="px-[20px] py-[12px] w-[400px] rounded-xl text-white bg-white/10 hover:bg-white/20 focus:bg-white/20 transition duration-200 ease-in-out outline-none"
      />
      <input
        type="text"
        name="username"
        placeholder="Username"
        className="mt-[20px] px-[20px] py-[12px] w-[400px] rounded-xl text-white bg-white/10 hover:bg-white/20 focus:bg-white/20 transition duration-200 ease-in-out outline-none"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="mt-[20px] px-[20px] py-[12px] w-[400px] rounded-xl text-white bg-white/10 hover:bg-white/20 focus:bg-white/20 transition duration-200 ease-in-out outline-none"
      />
      {/* <div className="w-full">
        <p className="text-[17px] font-semibold">Password Strength</p>
        <p>Must contain at least:</p>
        <div className="flex gap-[10px]">
          ✅<p>One uppercase letter</p>
        </div>
        <div className="flex gap-[10px]">
          ❌<p>One lowercase letter</p>
        </div>
        <p>One number</p>
        <p>One special character</p>
      </div> */}
      {/* <input
        type="password"
        placeholder="Confirm Password"
        className="mt-[20px] px-[20px] py-[12px] w-[400px] rounded-xl text-white bg-white/10 hover:bg-white/20 focus:bg-white/20 transition duration-200 ease-in-out outline-none"
      /> */}
      <button
        type="submit"
        className="font-semibold text-white bg-blue-600 relative bottom-0 hover:bottom-1 hover:shadow-[0_5px_40px_10px_rgb(37,99,235,0.5)] px-4 py-2 mt-[50px] rounded-xl transition-all duration-150 ease-in-out"
      >
        Register
      </button>
    </form>
  );
}
