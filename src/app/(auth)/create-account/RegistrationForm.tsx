"use client";

import { FormEvent, useState } from "react";

export default function RegistrationForm() {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const validateUsername = (value: string) => {
    const regex = /^[a-z0-9-_]+$/; // Only lowercase letters, numbers, dash, and underscore
    return regex.test(value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (validateUsername(value)) {
      setError("");
    } else {
      setError(
        "Username can only contain lowercase letters, numbers, dashes, and underscores.",
      );
    }
    setUsername(value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateUsername(username)) {
      setError(
        "Username can only contain lowercase letters, numbers, dashes, and underscores.",
      );
      return;
    }

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("email"),
          username: formData.get("username"),
          password: formData.get("password"),
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to register");
      } else {
        console.log("User registered successfully");
      }
    } catch (error) {
      setError("An error occurred during registration.");
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
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-[400px] rounded-xl bg-black/10 px-[20px] py-[12px] text-black outline-none transition duration-200 ease-in-out hover:bg-black/20 focus:bg-black/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:focus:bg-white/20"
      />
      <input
        type="text"
        name="username"
        value={username}
        onChange={handleUsernameChange}
        placeholder="Username"
        className="mt-[20px] w-[400px] rounded-xl bg-black/10 px-[20px] py-[12px] text-black outline-none transition duration-200 ease-in-out hover:bg-black/20 focus:bg-black/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:focus:bg-white/20"
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="mt-[20px] w-[400px] rounded-xl bg-black/10 px-[20px] py-[12px] text-black outline-none transition duration-200 ease-in-out hover:bg-black/20 focus:bg-black/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:focus:bg-white/20"
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
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
        className="relative bottom-0 mt-[50px] rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition-all duration-150 ease-in-out hover:bottom-1 hover:shadow-[0_5px_40px_10px_rgb(37,99,235,0.5)]"
      >
        Register
      </button>
    </form>
  );
}
