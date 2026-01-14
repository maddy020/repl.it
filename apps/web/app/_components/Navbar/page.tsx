"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../icons/logo.svg";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import dashboard from "../icons/dashboardImage.svg";
import { CustomSession } from "@repo/types";
import { LogOutIcon } from "lucide-react";
const Appbar = () => {
  const router = useRouter();

  const handleDashboard = () => {
    router.push("/dashboard/interviewer");
  };

  const {data:session,status}=useSession();
  const user=session && (session as CustomSession).user;
  if(status === "loading"){
    return <div>Loading...</div>
  }
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={logo}
              width={40}
              height={40}
              alt="logo"
              className="rounded-md border border-gray-300 p-1"
            />
            <h1 className="font-bold text-2xl">Repl.it</h1>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#"
              className="text-black/70 hover:text-black transition"
            >
              Products
            </Link>
            <Link
              href="#"
              className="text-black/70 hover:text-black transition"
            >
              API & Docs
            </Link>
            <Link
              href="#"
              className="text-black/70 hover:text-black transition"
            >
              FAQ
            </Link>
            <Link
              href="#"
              className="text-black/70 hover:text-black transition"
            >
              Company
            </Link>

            <button
              onClick={handleDashboard}
              className="flex items-center gap-2"
            >
              Dashboard
              <Image src={dashboard} width={22} height={22} alt="dashboard" />
            </button>


              <button
                onClick={() =>status === "unauthenticated" ? router.push("/auth"):signOut()}
                className="flex items-center gap-2 cursor-pointer"
              >
                {status === "unauthenticated"?"Login":`Hi , ${user?.name}`}
                {status === "authenticated" && (
                   <LogOutIcon className="h-4 w-4"/>
                 )}
              </button>
          </nav>

          {/* Mobile Menu */}
          <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={() => status === "unauthenticated" ? router.push("/auth"):signOut()}
                className="flex items-center gap-2"
              >
                {status === "unauthenticated"?"Login":`Hi , ${user?.name}` }
                 {status === "authenticated" && (
                   <LogOutIcon className="h-4 w-4 cursor-pointer"/>
                 )}
              </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Appbar;
