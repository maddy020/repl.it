"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import acme from "../icons/logo-acme_chpmz7.png";
import celestial from "../icons/logo-celestial_dv5uka.png";
import echo from "../icons/logo-echo_i5hnpv.png";
import pulse from "../icons/logo-pulse_woeaxa.png";
import quantum from "../icons/logo-quantum_hvfwas.png";
import heroimage from "../icons/HeroImage.png"
import React from "react";
import { Button } from "@/components/ui/button";
import user from "../icons/3d-casual-life-boy-with-laptop-sitting-on-floor.png";
import meet from "../icons/casual-life-3d-boy-studying-remotely-with-tutor.png";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { LogInIcon } from "lucide-react";
const logos = [
  acme,
  celestial,
  echo,
  pulse,
  quantum,
  acme,
  celestial,
  echo,
  pulse,
  quantum,
];

const LogoTicker = () => {
    const router = useRouter();
    const {status}=useSession();
  return (
    <>
     <section className="items-center mt-24 md:mt-40">
  <div className="relative mx-auto px-4">

    {/* User Icon */}
    <Image
      src={user}
      alt=""
      width={65}
      height={65}
      className="
        bg-white border p-2 rounded-full shadow-md
        animate-upDown
        hidden xl:block
        xl:absolute xl:w-[100px] xl:h-[100px]
        xl:left-[35rem] xl:-top-[7rem]
      "
    />

    {/* Meet Icon */}
    <Image
      src={meet}
      alt=""
      width={90}
      height={90}
      className="
        absolute bg-white border p-2 rounded-full shadow-md
        animate-upDown
        hidden xl:block
        xl:right-[32rem] xl:top-[70%]
        xl:w-[100px] xl:h-[100px]
      "
    />

    {/* Heading + Text */}
    <div className="mx-auto max-w-[600px] lg:max-w-[900px]">
      <h1
        className="
          text-center font-bold tracking-tight
          text-[39px] leading-[2.7rem]
          xl:text-[70px] xl:leading-[4.5rem]
        "
      >
        Build, run, and deploy instantly in the cloud.
      </h1>

      <p
        className="
          mt-4 text-center text-[19px]
          tracking-tight text-black/60
          xl:px-[12rem] xl:mt-9
        "
      >
        Spin up isolated environments, run code in seconds, and deploy directly from the browser.
        <br className="hidden md:block" />
              </p>
    </div>

    
    <div className="flex items-center justify-center mt-4 xl:mt-9">
        {status === "unauthenticated" ?<Button
          className="flex items-center gap-1 pl-2 py-6 text-base"
          onClick={() => router.push('/auth')}
        >
          Sign up 
          <LogInIcon className="h-4 w-4" />
        </Button>:
        <Button
          className="flex items-center gap-1 px-2 py-6 text-center"
          onClick={() => router.push('/dashboard')}
        >
         Get Started
        </Button>}
    </div>
  </div>
</section>

     <section className="px-4 my-10 md:px-72 my-24">
      <div className="p-3 bg-[#e8ecf0] rounded-xl">
        <Image
          src={heroimage}
          width={1400}
          height={800}
          alt="hero-image"
          className="drop-shadow-xl border rounded-lg"
        />
      </div>
    </section>
    <div className="w-full overflow-hidden py-10 bg-white">
      <div className="relative mx-auto max-w-6xl">
        <div className="overflow-hidden">
          <motion.div
            className="flex w-max items-center gap-12"
            animate={{ x: "-50%" }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {logos.map((logo, index) => (
              <Image
                key={index}
                src={logo}
                alt="Company logo"
                width={200}
                height={200}
                className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
    </>
  );
};

export default LogoTicker;
