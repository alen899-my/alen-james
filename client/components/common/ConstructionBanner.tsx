'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { HardHat, X, ChevronRight } from 'lucide-react';

const STORAGE_KEY = 'construction_banner_dismissed_v1';

export default function ConstructionBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          className="relative w-full overflow-hidden"
          style={{ zIndex: 9990 }}
        >
          {/* Hazard stripe background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `repeating-linear-gradient(
                -45deg,
                #f59e0b 0px,
                #f59e0b 12px,
                #1a1a1a 12px,
                #1a1a1a 24px
              )`,
              opacity: 0.12,
            }}
          />

          {/* Solid yellow bar */}
          <div
            className="relative flex items-center justify-between px-4 md:px-8 py-2.5 gap-3"
            style={{ background: '#f59e0b' }}
          >
            {/* Left — icon + text */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="shrink-0 w-7 h-7 rounded-full bg-black/15 flex items-center justify-center">
                <HardHat size={15} className="text-black" />
              </div>
              <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                <span className="text-black font-black text-[11px] md:text-xs uppercase tracking-widest whitespace-nowrap">
                  🚧 Under Construction
                </span>
                <span className="hidden sm:inline text-black/70 text-[11px] md:text-xs font-medium">
                  — Some exciting projects are being built. Check them out!
                </span>
              </div>
            </div>

            {/* Right — CTA + dismiss */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/under-construction"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black text-white text-[11px] font-black uppercase tracking-wider hover:bg-black/80 transition-colors"
                onClick={dismiss}
              >
                Check It Out <ChevronRight size={12} />
              </Link>
              <button
                onClick={dismiss}
                className="p-1.5 rounded-lg bg-black/10 hover:bg-black/20 transition-colors text-black"
                aria-label="Dismiss banner"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Bottom edge shadow line */}
          <div className="h-[2px]" style={{
            background: 'repeating-linear-gradient(-45deg, #f59e0b 0px, #f59e0b 8px, #d97706 8px, #d97706 16px)'
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
