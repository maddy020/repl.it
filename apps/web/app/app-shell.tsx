"use client"
import { usePathname } from "next/navigation";
import Appbar from "./_components/Navbar/page";
export default function AppShell() {
    const pathname=usePathname();
    const pathIncluded=pathname.includes("/auth");
    return (
    <>
    {!pathIncluded && <Appbar/> }
    </>
  );
}
