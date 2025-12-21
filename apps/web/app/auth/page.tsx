"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
export default function Auth() {
  const router = useRouter();
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (session) {
    router.push("/");
  }

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
