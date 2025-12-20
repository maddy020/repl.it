"use client";
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <button onClick={() => signIn("google")}>Sign in with google</button>
      <button
        onClick={() =>
          signIn("credentials", {
            name: "Guest",
            email: "Guest@gmail.com",
            password: "helloGuest",
          })
        }
      >
        Sign in
      </button>
    </>
  );
}
