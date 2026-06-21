'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Construction, Clock } from 'lucide-react';

export default function CrossedBanners() {
  return (
    <section className="relative w-full py-16 overflow-hidden flex flex-col items-center justify-center mb-12">
      {/* Tape 1 (Yellow, scrolls right, angled -2deg) */}
      <div 
        className="relative w-[120%] -ml-[10%] py-4 shadow-xl overflow-hidden flex items-center border-y-4 border-black"
        style={{
          transform: 'rotate(-2deg)',
          background: '#facc15',
          zIndex: 10
        }}
      >
        {/* Zebra stripes */}
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{
          background: 'repeating-linear-gradient(-45deg, #000 0px, #000 20px, transparent 20px, transparent 40px)'
        }} />
        <motion.div 
          className="flex whitespace-nowrap text-black font-black text-xs md:text-sm uppercase tracking-[0.25em] font-mono w-max"
          animate={{ x: ["-50%", "0%"] }}
          transition={{
            ease: "linear",
            duration: 65,
            repeat: Infinity,
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mx-6 shrink-0 flex items-center gap-1.5">
              <Construction size={14} /> ACTIVE BUILD ZONE // PORTFOLIO EXPANSION // EXPERIMENTAL PROJECTS IN PROGRESS // UNDER CONSTRUCTION
            </span>
          ))}
        </motion.div>
      </div>

      {/* Tape 2 (Black, scrolls left, angled 2.5deg) */}
      <div 
        className="relative w-[120%] -ml-[10%] py-4 shadow-2xl overflow-hidden flex items-center border-y-4 border-[#facc15] -mt-8"
        style={{
          transform: 'rotate(2.5deg)',
          background: '#09090b',
          zIndex: 20
        }}
      >
        <motion.div 
          className="flex whitespace-nowrap text-[#facc15] font-black text-xs md:text-sm uppercase tracking-[0.25em] font-mono w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 65,
            repeat: Infinity,
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mx-6 shrink-0 flex items-center gap-1.5">
              <Clock size={14} className="animate-spin" style={{ animationDuration: '4s' }} /> CAUTION: INVENTIVE CONCEPTS AHEAD // UPCOMING EXPERIMENTS // BUILDING THE DIGITAL FUTURE // ACTIVE LAB ZONE
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
