"use client";

import Button from "@/components/buttons/Button";
import FloatingInput from "@/components/inputs/FloatingInput";
import { PasswordInput } from "@/components/inputs/PasswordInput";
import { useLinkAccounts } from "@/hooks/api/account/useLinkAccounts";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function LinkAccountForm() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const {
    mutate: linkAccounts,
    isPending: isLinkingAccounts,
    error: linkAccountsError,
    isSuccess,
  } = useLinkAccounts();

  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (isSuccess) {
      router.push(`/profile/${session?.user?.username}`);
      router.refresh();
    }
  }, [isSuccess, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const currentUserId = session?.user?.id;

      if (!currentUserId) {
        throw new Error("No current user found");
      }

      const signInResult = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("Invalid credentials");
        return;
      }

      const authResponse = await fetch("/api/auth/session");
      if (!authResponse.ok) {
        throw new Error("Failed to get auth session");
      }

      const authData = await authResponse.json();
      const linkedUserId = authData.user?.id;

      if (!linkedUserId) {
        throw new Error("Could not identify linked user");
      }

      if (currentUserId === linkedUserId) {
        throw new Error("Cannot link an account to itself");
      }

      linkAccounts(
        {
          currentUserId,
          linkedUserId,
        },
        {
          onError: (error) => {
            setError(error.message);
          },
        },
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-[50px] flex flex-col items-center"
    >
      <div className={"flex flex-col gap-6"}>
        <FloatingInput
          type="text"
          name="email"
          value={identifier}
          onChange={handleIdentifierChange}
          placeholder="Email or Username"
          required
        />
        <PasswordInput
          name="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Password"
          required
        />
      </div>
      <div className="mt-2 w-full text-end">
        <Link
          href={"/reset-password"}
          className="text-[13px] font-semibold hover:text-blue-500"
        >
          Forgot password?
        </Link>
      </div>

      {linkAccountsError && (
        <p className="mb-3 text-red-500">{linkAccountsError.message}</p>
      )}

      <Button
        type="submit"
        variant="primary_glow"
        disabled={isLinkingAccounts || !!error || areFieldsEmpty}
        className={`mt-8 bg-blue-600 text-white ${
          isLinkingAccounts || !!error || areFieldsEmpty
            ? "cursor-not-allowed opacity-50 hover:bottom-0 hover:shadow-none"
            : "opacity-100 hover:bottom-1 hover:shadow-[0_5px_40px_10px_rgb(37,99,235,0.5)]"
        }`}
      >
        {isLinkingAccounts ? "Linking..." : "Link Account"}
      </Button>
    </form>
  );
}
