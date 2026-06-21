'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';
import { WhatsNew } from '@/lib/admin/models/whats_new.model';

interface WhatsNewPopupProps {
  activeItem: WhatsNew | null;
}

export default function WhatsNewPopup({ activeItem }: WhatsNewPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!activeItem) return;
    const storageKey = `whats_new_seen_${activeItem.id}`;
    if (localStorage.getItem(storageKey) === 'true') return;
    const timer = setTimeout(() => setIsOpen(true), 2200);
    return () => clearTimeout(timer);
  }, [activeItem]);

  if (!activeItem) return null;

  const handleClose = () => {
    localStorage.setItem(`whats_new_seen_${activeItem.id}`, 'true');
    setIsOpen(false);
  };

  const handleCtaClick = () => {
    localStorage.setItem(`whats_new_seen_${activeItem.id}`, 'true');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center sm:p-4">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 dark:bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Card — 50/50 */}
          <motion.div
            className="relative z-10 w-full sm:max-w-[660px] overflow-hidden flex flex-col sm:flex-row
                       bg-white dark:bg-[#111111]
                       shadow-2xl dark:shadow-[0_8px_40px_rgba(0,0,0,0.7)]"
            style={{ borderRadius: 0, minHeight: '320px' }}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            {/* ── LEFT — Image 50% ── */}
            <div className="relative w-full sm:w-1/2 shrink-0 overflow-hidden bg-[#f5f5f5] dark:bg-[#1a1a1a]"
              style={{ minHeight: '200px' }}
            >
              {activeItem.image_url ? (
                <>
                  <img
                    src={activeItem.image_url}
                    alt={activeItem.title}
                    className="absolute inset-0 w-full h-full object-cover select-none"
                    draggable={false}
                  />
                  {/* Subtle gradient overlay at bottom */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}
                  />
                </>
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: 'linear-gradient(160deg, #1084a2, #0b5c73)' }}
                >
                  <Zap size={52} className="text-white/60" fill="rgba(255,255,255,0.25)" />
                </div>
              )}
            </div>

            {/* ── RIGHT — Content 50% ── */}
            <div className="flex flex-col flex-1 min-w-0 w-full sm:w-1/2 border-t sm:border-t-0 sm:border-l border-[#f0f0f0] dark:border-white/10">


              {/* Close button — top right of content */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 flex items-center justify-center w-7 h-7
                           text-[#666] dark:text-[#8b9aaa]
                           hover:text-[#111] dark:hover:text-white
                           hover:bg-black/8 dark:hover:bg-white/10
                           transition-colors cursor-pointer z-10"
                style={{ borderRadius: 0 }}
                aria-label="Close"
              >
                <X size={14} />
              </button>

              {/* Scrollable body */}
              <div className="flex-1 px-5 pt-5 pb-3 overflow-y-auto flex flex-col gap-3" style={{ maxHeight: '300px' }}>

                {/* Badge */}
                <div className="flex items-center gap-1.5">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-white text-[9px] font-black tracking-widest uppercase"
                    style={{ background: '#1084a2', borderRadius: 0 }}
                  >
                    <Zap size={8} fill="currentColor" /> What's New
                  </span>
                </div>

                {/* Title */}
                <h2
                  className="text-[18px] font-black leading-snug text-[#111] dark:text-white pr-6"
                  style={{ fontFamily: '"Calistoga", serif', letterSpacing: '-0.01em' }}
                >
                  {activeItem.title}
                </h2>

                {/* Accent divider */}
                <div className="w-8 h-[2px]" style={{ background: '#1084a2' }} />

                {/* Content text */}
                <p
                  className="text-[13px] leading-relaxed text-[#444] dark:text-[#aaa] whitespace-pre-line"
                  style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                >
                  {activeItem.content}
                </p>


              </div>

              {/* Divider */}
              <div className="mx-5 border-t border-[#f0f0f0] dark:border-white/10" />

              {/* Footer actions */}
              <div className="px-5 py-4 flex flex-col gap-2 shrink-0">
                {activeItem.btn_url ? (
                  <a
                    href={activeItem.btn_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleCtaClick}
                    className="w-full text-center py-2.5 text-[13px] font-black text-white uppercase tracking-wide transition-all active:scale-[0.98] select-none hover:brightness-110"
                    style={{ borderRadius: '6px', background: '#1084a2' }}
                  >
                    {activeItem.btn_text || 'Check It Out →'}
                  </a>
                ) : (
                  <button
                    onClick={handleClose}
                    className="w-full py-2.5 text-[13px] font-black text-white uppercase tracking-wide transition-all active:scale-[0.98] select-none hover:brightness-110"
                    style={{ borderRadius: '6px', background: '#1084a2' }}
                  >
                    Got It →
                  </button>
                )}

                <button
                  onClick={handleClose}
                  className="text-[11px] text-[#999] dark:text-[#666] hover:text-[#333] dark:hover:text-[#aaa] transition-colors underline cursor-pointer select-none text-center"
                >
                  Dismiss, don't show again
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
