"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LinkAccountForm() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setError(null);
  //   setIsLoading(true);

  //   const formData = new FormData(e.currentTarget);
  //   const identifier = formData.get("email") as string;
  //   const password = formData.get("password") as string;

  //   try {
  //     // Store the current user's ID before signing in
  //     const currentUserId = session?.user?.id;

  //     if (!currentUserId) {
  //       throw new Error("No current user found");
  //     }

  //     // Attempt to sign in with the provided credentials
  //     const signInResult = await signIn("credentials", {
  //       identifier,
  //       password,
  //       redirect: false,
  //     });

  //     if (signInResult?.error) {
  //       setError("Invalid credentials");
  //       setIsLoading(false);
  //       return;
  //     }

  //     // Wait for the session to update
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     await update();

  //     // Fetch the user data for the account to be linked
  //     const userResponse = await fetch("/api/user");

  //     // const userResponse = await fetch("/api/user", {
  //     //   headers: {
  //     //     Authorization: `Bearer ${signInResult?.url?.split("callbackUrl=")[1]}`,
  //     //   },
  //     // });

  //     if (!userResponse.ok) {
  //       const errorData = await userResponse.json();
  //       throw new Error(errorData.error || "Failed to fetch user data");
  //     }

  //     const linkedUserData = await userResponse.json();

  //     if (currentUserId === linkedUserData.id) {
  //       throw new Error("Cannot link an account to itself");
  //     }

  //     // const userData = await userResponse.json();

  //     // Link the account
  //     const linkResponse = await fetch("/api/link-account", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         currentUserId: currentUserId,
  //         linkedUserId: linkedUserData.id,
  //         // linkedUserId: userData.id,
  //       }),
  //     });

  //     if (!linkResponse.ok) {
  //       const errorData = await linkResponse.json();
  //       throw new Error(errorData.error || "Failed to link account");
  //     }

  //     // Account linked successfully
  //     // router.push("/profile");
  //     // router.refresh();
  //   } catch (error) {
  //     console.error("Error linking account:", error);
  //     setError(
  //       error instanceof Error ? error.message : "An unexpected error occurred",
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log("Starting account linking process");

    try {
      const currentUserId = session?.user?.id;
      console.log("Current user ID:", currentUserId);

      if (!currentUserId) {
        throw new Error("No current user found");
      }

      console.log("Attempting to sign in with new credentials");
      const signInResult = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      console.log("Sign in result:", signInResult);

      if (signInResult?.error) {
        setError("Invalid credentials");
        setIsLoading(false);
        return;
      }

      console.log("Waiting for session update");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await update();

      console.log("Fetching linked user data");
      const userResponse = await fetch("/api/user");
      console.log("User response status:", userResponse.status);

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        console.error("Error fetching user data:", errorData);
        throw new Error(errorData.error || "Failed to fetch user data");
      }

      const linkedUserData = await userResponse.json();
      console.log("Linked user data:", linkedUserData);

      if (currentUserId === linkedUserData.id) {
        throw new Error("Cannot link an account to itself");
      }

      console.log("Sending link account request");
      const linkResponse = await fetch("/api/link-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUserId: currentUserId,
          linkedUserId: linkedUserData.id,
        }),
      });

      console.log("Link response status:", linkResponse.status);

      if (!linkResponse.ok) {
        const errorData = await linkResponse.json();
        console.error("Error linking account:", errorData);
        throw new Error(errorData.error || "Failed to link account");
      }

      const linkResult = await linkResponse.json();
      console.log("Link result:", linkResult);

      console.log("Account linked successfully");
      router.push("/profile");
      router.refresh();
    } catch (error) {
      console.error("Error in account linking process:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-[50px] flex flex-col items-center"
    >
      {error && <p className="mb-4 text-red-500">{error}</p>}
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
