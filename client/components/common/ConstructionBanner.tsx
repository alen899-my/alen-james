'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface ConstructionBannerProps {
  isUpcoming?: boolean;
  hideCard?: boolean;
  themeColor?: 'yellow' | 'amber' | 'red';
}

export default function ConstructionBanner({ 
  isUpcoming = false, 
  hideCard = false,
  themeColor
}: ConstructionBannerProps) {
  const pathname = usePathname();
  const isUnderConstruction = pathname === '/under-construction';

  let tapeBg = '#facc15'; // Default yellow
  let tapeText = "🚧 PROJECTS UNDER CONSTRUCTION // CURRENT & PLANNED PROJECTS // BUILDING THE FUTURE 🚧 ";
  let textColor = "text-black";

  if (themeColor === 'red') {
    tapeBg = '#dc2626'; // Red-600
    tapeText = "🚧 ACTIVE BUILD SITE // PROJECTS IN PROGRESS // UNDER CONSTRUCTION // BUILDING NOW 🚧 ";
    textColor = "text-white";
  } else if (themeColor === 'amber' || isUpcoming) {
    tapeBg = '#f59e0b'; // Amber
    tapeText = "⏳ COMING SOON // FUTURE IDEAS & EXPERIMENTAL CONCEPTS // ROADMAP // COOKING THE FUTURE ⏳ ";
    textColor = "text-black";
  }

  return (
    <section className={`relative w-full bg-[var(--background)] flex flex-col items-center justify-center ${hideCard ? 'pt-6 pb-6 min-h-0' : 'pt-10 pb-20 min-h-[180px]'}`}>
      {/* Straight Tape */}
      <div 
        className="relative w-full py-4 md:py-5 border-y-4 border-black z-10 shadow-md"
        style={{ background: tapeBg }}
      >
        <div className="flex whitespace-nowrap overflow-hidden">
          <motion.div 
            className={`flex whitespace-nowrap text-lg md:text-2xl font-black uppercase tracking-widest ${textColor}`}
            animate={{ x: ["-50%", "0%"] }}
            transition={{
              ease: "linear",
              duration: 60,
              repeat: Infinity,
            }}
          >
            {/* Repeated items for seamless infinite scroll */}
            <span className="mx-4 shrink-0">{tapeText}</span>
            <span className="mx-4 shrink-0">{tapeText}</span>
            <span className="mx-4 shrink-0">{tapeText}</span>
            <span className="mx-4 shrink-0">{tapeText}</span>
          </motion.div>
        </div>
      </div>

      {/* Hanging Notice Board Card */}
      {!hideCard && (
        <div className="relative z-20 -mt-1 pointer-events-auto flex flex-col items-center">
          {/* Hanging Strings/Wires */}
          <div className="flex justify-between w-48 relative h-6 pointer-events-none">
            <div className="w-[3px] h-6 bg-black" />
            <div className="w-[3px] h-6 bg-black" />
          </div>

          {/* Card */}
          <Link href={isUnderConstruction ? "/" : "/under-construction"} className="group block">
            <div 
              className="bg-black text-[#facc15] border-4 border-black px-8 py-3.5 rounded-lg shadow-xl transition-all duration-300 transform group-hover:scale-105 active:scale-95 text-center flex flex-col items-center justify-center"
              style={{ fontFamily: '"Patrick Hand SC", cursive' }}
            >
              <span className="text-xl md:text-2xl font-black uppercase tracking-wider text-white group-hover:text-[#facc15] transition-colors">
                {isUnderConstruction ? "Welcome to the Site" : "Inspect the Site"}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-sans mt-0.5">
                {isUnderConstruction ? "Go back to Home" : "Click to Enter Zone"}
              </span>
            </div>
          </Link>
        </div>
      )}
    </section>
  );
}
