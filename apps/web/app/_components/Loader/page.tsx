"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NoirLoader() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push("/error"), 25000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <AnimatePresence>
      (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
        >
          <div className="relative flex flex-col items-center">
            {/* Minimalist Logo */}
            <motion.h1 
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              animate={{ opacity: 1, letterSpacing: "-0.02em" }}
              className="text-4xl font-black text-white md:text-5xl"
            >
                REPL.IT
            </motion.h1>

            {/* Monochrome Scanning Line */}
            <div className="relative mt-6 h-[1px] w-64 bg-zinc-800">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute h-full w-1/3 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_10px_#fff]"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="mt-8 text-[10px] uppercase tracking-[0.5em] text-zinc-400"
            >
              System Secure // Loading
            </motion.p>
          </div>
        </motion.div>
      )
    </AnimatePresence>
  );
}