'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Megaphone } from 'lucide-react';
import { WhatsNew } from '@/lib/admin/models/whats_new.model';

interface WhatsNewPopupProps {
  activeItem: WhatsNew | null;
}

export default function WhatsNewPopup({ activeItem }: WhatsNewPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!activeItem) return;

    // Check if user has already dismissed this specific announcement
    const storageKey = `whats_new_seen_${activeItem.id}`;
    const hasSeen = localStorage.getItem(storageKey);

    if (hasSeen === 'true') return;

    // Wait 2.2 seconds to allow the site preloader to fully complete and slide out
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2200);

    return () => clearTimeout(timer);
  }, [activeItem]);

  if (!activeItem) return null;

  const handleClose = () => {
    // Save to localStorage so it doesn't pop up again for this announcement ID
    localStorage.setItem(`whats_new_seen_${activeItem.id}`, 'true');
    setIsOpen(false);
  };

  const handleCtaClick = () => {
    // Mark as seen when clicking CTA as well, so we don't annoy them next time
    localStorage.setItem(`whats_new_seen_${activeItem.id}`, 'true');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/45 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Popup Card */}
          <motion.div
            className="relative w-full max-w-[420px] rounded-3xl overflow-hidden shadow-2xl border border-[#e8e2d5] flex flex-col z-10"
            style={{
              background: '#fdf8e1', // Matches var(--page-bg)
              color: '#2d2a21', // Matches var(--page-text)
            }}
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          >
            {/* Close Button X */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors cursor-pointer text-[#2d2a21]"
              aria-label="Close announcement"
            >
              <X size={16} />
            </button>

            {/* Banner/Cover Image */}
            {activeItem.image_url ? (
              <div className="relative w-full h-[190px] overflow-hidden bg-black/5 shrink-0 border-b border-[#e8e2d5]/60 select-none">
                <img
                  src={activeItem.image_url}
                  alt={activeItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-[#1084a2] text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles size={10} /> What's New
                </div>
              </div>
            ) : (
              <div className="px-6 pt-8 pb-1 shrink-0 select-none">
                <span className="inline-flex items-center gap-1 bg-[#1084a2]/15 text-[#1084a2] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-[#1084a2]/20">
                  <Megaphone size={10} /> Announcement
                </span>
              </div>
            )}

            {/* Text & Content details */}
            <div className="px-6 pt-5 pb-6 flex-1 flex flex-col gap-4 overflow-y-auto max-h-[300px]">
              <h2
                className="text-2xl font-bold leading-tight tracking-tight select-none"
                style={{ fontFamily: '"Calistoga", serif' }}
              >
                {activeItem.title}
              </h2>

              <p
                className="text-[15px] leading-relaxed text-[#2d2a21]/85 whitespace-pre-line font-medium"
                style={{ fontFamily: '"Patrick Hand SC", cursive' }}
              >
                {activeItem.content}
              </p>
            </div>

            {/* Actions Footer */}
            <div className="px-6 pb-6 pt-2 flex flex-col gap-3 shrink-0">
              {activeItem.btn_url ? (
                <a
                  href={activeItem.btn_url}
                  onClick={handleCtaClick}
                  className="w-full text-center py-3 text-sm font-bold text-white rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] select-none hover:brightness-110"
                  style={{
                    background: 'linear-gradient(135deg, #1084a2, #1a9bbf)',
                  }}
                >
                  {activeItem.btn_text || 'Check It Out'}
                </a>
              ) : (
                <button
                  onClick={handleClose}
                  className="w-full py-3 text-sm font-bold text-white rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] select-none hover:brightness-110"
                  style={{
                    background: 'linear-gradient(135deg, #1084a2, #1a9bbf)',
                  }}
                >
                  Awesome, got it!
                </button>
              )}

              <button
                onClick={handleClose}
                className="text-xs text-[#8b9aaa] hover:text-[#2d2a21] transition-colors underline cursor-pointer select-none"
              >
                Dismiss & don't show again
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
