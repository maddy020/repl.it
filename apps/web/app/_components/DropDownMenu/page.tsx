"use client";
import { CustomSession } from "@repo/types";
import axios from "axios";
import { Session } from "next-auth";
export default function DropDownMenuPage({ session }: { session: Session }) {
  const handleCreateRepl = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/repl/create`,
        {
          language: "nodejs",
          name: "gamerCoder",
        },
        {
          headers: {
            Authorization: `Bearer ${(session as unknown as CustomSession).accessToken}`,
          },
        }
      );
      console.log("Repl created:", response.data);
    } catch (error) {
      console.log("Error creating repl:", error);
    }
  };
  return (
    <>
      <button onClick={handleCreateRepl}>Create Repl</button>
    </>
  );
}
