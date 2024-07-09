"use client";

import MainNavBar from "@/components/menus/MainNavBar";
import Home from "./(main)/home/page";
import { useSession } from "next-auth/react";

export default function Test() {
  const { data: session, status } = useSession();

  if (!session) {
    return (
      <>
        <div className="mt-[70px]">
          {/* <MainNavBar /> */}
          {/* <Home /> */}
        </div>
      </>
    );
  }
}
