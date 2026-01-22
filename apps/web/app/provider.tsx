"use client";

import { getServerSession } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]/route";

export async function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions)
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
