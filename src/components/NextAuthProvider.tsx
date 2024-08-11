"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface NextAuthProviderProps {
  children: ReactNode;
  session: Session | null;
}

const NextAuthProvider: React.FC<NextAuthProviderProps> = ({
  children,
  session,
}) => {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      {children}
    </SessionProvider>
  );
};

export default NextAuthProvider;
