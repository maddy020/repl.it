"use client";
import { Button } from "@/components/ui/button";
import { CustomSession } from "@repo/types";
import axios from "axios";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
export default function DropDownMenuPage({ session }: { session: Session }) {
  const router = useRouter();

  const handleCreateRepl = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/repl/create`,
        {
          language: "nodejs",
        },
        {
          headers: {
            Authorization: `Bearer ${(session as unknown as CustomSession).accessToken}`,
          },
        }
      );
      if(response.data.repl.replId){
        setTimeout(()=>{
          router.replace(`/repl/${response.data.repl.replId}`);
        },11000)
      }
    } catch (error) {
      console.log("Error creating repl:", error);
    }
  };
  return (
    <>
      <Button onClick={handleCreateRepl}>Create Repl</Button>
    </>
  );
}
