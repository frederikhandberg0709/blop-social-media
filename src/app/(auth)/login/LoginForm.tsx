"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import FloatingInput from "@/components/inputs/FloatingInput";
import { Eye, EyeOff } from "lucide-react";
import { Tooltip } from "@/components/Tooltip";

export default function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
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

        <div className="relative">
          <FloatingInput
            type={showPassword ? "text" : "password"}
            placeholder={"Password"}
            name={"password"}
            value={password}
            onChange={handlePasswordChange}
            disabled={isLoading}
            required
          />
          <div className="absolute inset-y-1.5 right-1.5">
            <Tooltip
              text={showPassword ? "Hide Password" : "Show Password"}
              offset={"50"}
              className="h-full"
            >
              <button
                type="button"
                className="hover:black/5 group flex aspect-square h-full items-center justify-center rounded-[6px] transition duration-200 ease-in-out active:bg-white/10 dark:hover:bg-white/5 dark:active:bg-white/10"
              >
                {showPassword ? (
                  <Eye
                    size={20}
                    className="opacity-50 transition duration-200 ease-in-out group-hover:opacity-100"
                  />
                ) : (
                  <EyeOff
                    size={20}
                    className="opacity-50 transition duration-200 ease-in-out group-hover:opacity-100"
                  />
                )}
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="mt-2 w-full text-end">
        <Link
          href={"#"}
          className="text-[13px] font-semibold hover:text-blue-500 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {error && <p className="mt-3 text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={!!error || areFieldsEmpty || isLoading}
        className={`relative bottom-0 mt-[30px] rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition-all duration-150 ease-in-out ${!!error || areFieldsEmpty ? "cursor-not-allowed opacity-50" : "opacity-100 hover:bottom-1 hover:shadow-[0_5px_40px_10px_rgb(37,99,235,0.5)]"}`}
      >
        Login
      </button>
    </form>
  );
}
