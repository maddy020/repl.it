"use client";
import { motion } from "framer-motion";
import { Search, MoveLeft, Terminal } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden font-sans">
      
      {/* Background Grid - Subtle Grey Lines */}
      <div className="absolute inset-0 z-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]">
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="relative z-10 px-6 text-center">
        {/* Giant Hollow 404 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <h1 className="text-[12rem] md:text-[20rem] font-black leading-none tracking-tighter text-transparent border-text select-none opacity-20"
              style={{ WebkitTextStroke: "1px #3f3f46" }}>
            404
          </h1>
          
          {/* Floating Search Icon */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-black shadow-[0_0_50px_rgba(255,255,255,0.3)]">
              <Search className="h-8 w-8" />
            </div>
          </motion.div>
        </motion.div>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="-mt-8 md:-mt-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-widest mb-4">
            Endpoint Not Found
          </h2>
          <p className="text-zinc-500 max-w-sm mx-auto mb-10 text-sm font-mono tracking-tight">
            The path <span className="text-zinc-300">"{typeof window !== 'undefined' ? window.location.pathname : '/unknown'}"</span> does not exist in our current deployment.
          </p>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/"
              className="group flex items-center gap-3 text-white text-xs font-bold uppercase tracking-[0.3em] transition-all hover:text-zinc-400"
            >
              <MoveLeft className="h-4 w-4 transition-transform group-hover:-translate-x-2" />
              Return to Safety
            </Link>
            
            <div className="hidden sm:block h-1 w-1 rounded-full bg-zinc-700"></div>
            
            <span className="flex items-center gap-2 text-[10px] text-zinc-600 uppercase font-bold tracking-[0.2em]">
              <Terminal className="h-3 w-3" />
              Status: 404_NULL
            </span>
          </div>
        </motion.div>
      </div>

      {/* Side Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
    </div>
  );
}