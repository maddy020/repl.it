// import {
//   FaDiscord,
//   FaDribbble,
//   FaFacebook,
//   FaGithub,
//   FaXTwitter,
// } from "react-icons/fa6";
// import Logo from "./icons/Logo";
import Link from "next/link";
import Logo from "../icons/Logo";

export function Footer() {
  return (
    <footer className="bg-black text-[#90939b] p-10 xl:p-20 flex flex-col gap-10">
      {/* Top */}
      <div className="flex flex-col gap-4 xl:flex-row xl:justify-between">
        {/* Logo */}
        <div
          className="
            border border-white/25 rounded-md
            shadow-[inset_0_0_5px_rgba(255,255,255,0.55)]
            h-10 w-10
            flex items-center justify-center
          "
        >
          <Logo className="h-8 w-8" fill="#ffffff" />
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4 text-sm font-medium">
            <h2 className="text-base font-semibold text-white">
              Resources
            </h2>
            <ul className="flex flex-col gap-3">
              <li>Create Collab</li>
              <li>Documentation</li>
              <li>API reference</li>
            </ul>
          </div>

          <div className="flex flex-col gap-4 text-sm font-medium">
            <h2 className="text-base font-semibold text-white">
              Follow us
            </h2>
            <ul className="flex flex-col gap-3">
              <li>Github</li>
              <li>Discord</li>
            </ul>
          </div>

          <div className="flex flex-col gap-4 text-sm font-medium">
            <h2 className="text-base font-semibold text-white">
              Legal
            </h2>
            <ul className="flex flex-col gap-3">
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <span className="text-sm text-gray-400">
          © 2024 Repl.it All Rights Reserved.
        </span>

        <div className="flex gap-4 text-lg text-gray-400">
          <Link href="#">
            {/* <FaFacebook /> */}
            <span className="sr-only">Facebook page</span>
          </Link>
          <Link href="#">
            {/* <FaDiscord /> */}
            <span className="sr-only">Discord community</span>
          </Link>
          <Link href="#">
            {/* <FaXTwitter /> */}
            <span className="sr-only">Twitter page</span>
          </Link>
          <Link href="#">
            {/* <FaGithub /> */}
            <span className="sr-only">GitHub account</span>
          </Link>
          <Link href="#">
            {/* <FaDribbble /> */}
            <span className="sr-only">Dribbble account</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
