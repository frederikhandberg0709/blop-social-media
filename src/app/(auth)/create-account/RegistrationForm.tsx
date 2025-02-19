"use client";

import { FormEvent, useState } from "react";
import Input from "@/components/inputs/FloatingInput";
import { PasswordInput } from "@/components/inputs/PasswordInput";
import {
  getPasswordErrorMessage,
  getPasswordMatchErrorMessage,
  validateEmail,
  validatePassword,
  validateUsername,
} from "@/utils/accountValidation";

export default function RegistrationForm() {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const areFieldsEmpty = [email, username, password, confirmPassword].some(
    (field) => field.trim() === "",
  );

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    if (!validateUsername(value)) {
      setError(
        "Username can only contain lowercase letters, numbers, dashes, and underscores.",
      );
    } else {
      setError("");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (!validateEmail(value)) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (!validatePassword(value)) {
      setError(
        "Password must be at least 8 characters long and contain at least one special character.",
      );
    } else {
      setError("");
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (password !== value) {
      setError("Passwords do not match.");
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!validateUsername(username)) {
      setError(
        "Username can only contain lowercase letters, numbers, dashes, and underscores",
      );
      return;
    }

    const passwordError = getPasswordErrorMessage(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    const matchError = getPasswordMatchErrorMessage(password, confirmPassword);
    if (matchError) {
      setError(matchError);
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to register");
      } else {
        setSuccessMessage("User registered successfully! You can now log in.");
        setEmail("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
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
      <div className={"flex flex-col gap-6"}>
        <Input
          type={"email"}
          placeholder={"Email"}
          size={"md"}
          variant={"default"}
          value={email}
          onChange={handleEmailChange}
          required
        />

        <Input
          placeholder={"Username"}
          size={"md"}
          variant={"default"}
          value={username}
          onChange={handleUsernameChange}
          required
        />

        <PasswordInput
          name={"password"}
          value={password}
          onChange={handlePasswordChange}
          placeholder={"Password"}
        />

        <PasswordInput
          name={"confirmPassword"}
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder={"Confirm Password"}
        />
      </div>

      <div className={"mt-3"}>
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
      </div>

      <button
        type="submit"
        disabled={!!error || areFieldsEmpty}
        className={`relative bottom-0 mt-[30px] rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition-all duration-150 ease-in-out ${!!error || areFieldsEmpty ? "cursor-not-allowed opacity-50" : "opacity-100 hover:bottom-1 hover:shadow-[0_5px_40px_10px_rgb(37,99,235,0.5)]"}`}
      >
        Register
      </button>
    </form>
  );
}
