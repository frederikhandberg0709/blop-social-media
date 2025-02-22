"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import FloatingInput from "@/components/inputs/FloatingInput";
import { PasswordInput } from "@/components/inputs/PasswordInput";
import Button from "@/components/buttons/Button";

export default function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const areFieldsEmpty = [identifier, password].some(
    (field) => field.trim() === "",
  );

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentifier(e.target.value);
    setError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await signIn("credentials", {
        identifier: identifier.trim(),
        password: password.trim(),
        redirect: false,
      });

      if (!response?.ok) {
        const errorMessage =
          response?.error == "CredentialsSignin"
            ? "Invalid email/username or password"
            : response?.error || "An error occurred during login";

        setError(errorMessage);
        return;
      }

      router.push("/home");
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-[50px] flex flex-col items-center"
    >
      <div className={"flex flex-col gap-6"}>
        <FloatingInput
          placeholder={"Email or Username"}
          name={"email"}
          value={identifier}
          onChange={handleIdentifierChange}
          disabled={isLoading}
          required
        />

        <PasswordInput
          placeholder={"Password"}
          name={"password"}
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <div className="mt-2 w-full text-end">
        <Link
          href={"/reset-password"}
          className="text-[13px] font-semibold hover:text-blue-500 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {error && <p className="mt-3 text-red-500">{error}</p>}

      <Button
        type="submit"
        variant="primary_glow"
        disabled={!!error || areFieldsEmpty || isLoading}
        className={`mt-8 bg-blue-600 text-white ${!!error || areFieldsEmpty ? "cursor-not-allowed opacity-50 hover:bottom-0 hover:shadow-none" : "opacity-100 hover:bottom-1 hover:shadow-[0_5px_40px_10px_rgb(37,99,235,0.5)]"}`}
      >
        Login
      </Button>
    </form>
  );
}
