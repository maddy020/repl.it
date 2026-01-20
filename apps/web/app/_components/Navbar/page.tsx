"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../icons/logo.svg";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { CustomSession } from "@repo/types";
import { LogOutIcon } from "lucide-react";
import Loader from "../Loader/page";
const Appbar = () => {
  const router = useRouter();
  const {data:session,status}=useSession();
  const user=session && (session as CustomSession).user;
  if(status === "loading"){
    return <Loader/>
  }
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={()=>router.push("/")}>
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
              href="/#product"
              className="text-black/70 hover:text-black transition"
            >
              Product
            </Link>
            <Link
              href="/#api"
              className="text-black/70 hover:text-black transition"
            >
              API & Docs
            </Link>
            <Link
              href="/#features"
              className="text-black/70 hover:text-black transition"
            >
              Features
            </Link>

            <Link
              href="/dashboard"
              className="text-black/70 hover:text-black transition"
            >
              Dashboard
            </Link>


              <button
                onClick={() =>status === "unauthenticated" ? router.push("/auth"):signOut()}
                className="flex items-center gap-2 cursor-pointer text-black/70 hover:text-black transition"
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
