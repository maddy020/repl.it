"use client";
import { motion } from "framer-motion";
import { RotateCcw, Home, Ghost, Command } from "lucide-react";

export default function NoirErrorPage({ reset }: { reset?: () => void }) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden font-sans selection:bg-white selection:text-black">
      
      {/* Background Subtle Grain */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Decorative "Scanner" lines in the background */}
      <div className="absolute inset-0 flex flex-col justify-around opacity-10 pointer-events-none">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-500 to-transparent" />
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-500 to-transparent" />
      </div>

      <div className="relative z-10 px-6 text-center">
        {/* Modern Icon with Glass Effect */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl"
        >
          <Ghost className="h-10 w-10 text-zinc-100 stroke-[1.5px]" />
        </motion.div>

        {/* Typography Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-[calc(-0.05em)] text-white mb-4">
            LOST<span className="text-zinc-700">.</span>
          </h1>
          <p className="text-zinc-500 max-w-xs mx-auto mb-12 text-sm md:text-base font-medium leading-relaxed tracking-tight">
            The request was interrupted by an unexpected system error. 
            Please re-initialize or return home.
          </p>
        </motion.div>

        {/* Noir Action Buttons */}
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Primary Action */}
          <button
            onClick={() => reset?.() || window.location.reload()}
            className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all duration-300 active:scale-95"
          >
            <RotateCcw className="h-4 w-4 group-hover:rotate-[-45deg] transition-transform duration-300" />
            Try Again
          </button>
          
          {/* Secondary Action */}
          <a
            href="/"
            className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 border border-zinc-800 text-zinc-400 font-bold text-xs uppercase tracking-widest hover:border-white hover:text-white transition-all duration-300"
          >
            <Home className="h-4 w-4" />
            Home Base
          </a>
        </motion.div>
      </div>

      {/* Static Footer Label */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-20">
        <Command className="w-4 h-4 text-white" />
        <span className="text-[10px] text-white font-bold tracking-[0.4em] uppercase">Error 500 // Intervue Core</span>
      </div>
    </div>
  );
}