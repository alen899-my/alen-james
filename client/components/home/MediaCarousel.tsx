'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import Image from 'next/image';

interface MediaCarouselProps {
    media: string[];
    title: string;
}

const MediaCarousel = ({ media, title }: MediaCarouselProps) => {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-scroll functionality
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer || media.length === 0) return;

        const startAutoScroll = () => {
            autoScrollIntervalRef.current = setInterval(() => {
                if (scrollContainer) {
                    scrollContainer.scrollBy({
                        left: 300, // Scroll amount per interval
                        behavior: 'smooth',
                    });

                    // Reset to beginning when reaching the end
                    if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 10) {
                        setTimeout(() => {
                            scrollContainer.scrollTo({
                                left: 0,
                                behavior: 'smooth',
                            });
                        }, 500);
                    }
                }
            }, 3000); // Scroll every 3 seconds
        };

        const handleMouseEnter = () => {
            if (autoScrollIntervalRef.current) {
                clearInterval(autoScrollIntervalRef.current);
            }
        };

        const handleMouseLeave = () => {
            startAutoScroll();
        };

        startAutoScroll();
        scrollContainer.addEventListener('mouseenter', handleMouseEnter);
        scrollContainer.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            if (autoScrollIntervalRef.current) {
                clearInterval(autoScrollIntervalRef.current);
            }
            scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
            scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [media.length]);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxIndex(null);
        document.body.style.overflow = '';
    };

    const prevMedia = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex - 1 + media.length) % media.length);
        }
    };

    const nextMedia = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex + 1) % media.length);
        }
    };

    return (
        <section className="py-12 overflow-hidden bg-[var(--background)]">
            <div className="relative w-full">
                {/* Horizontal Scrolling Container - Auto-scrolls slowly */}
                <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 px-4 md:px-[5%] no-scrollbar pb-12"
                >
                    {media.map((url, i) => {
                        const isVideo = url.toLowerCase().match(/\.(mp4|webm|ogg)$/) || url.includes('video');
                        
                        return (
                            <div
                                key={i}
                                className="group relative flex-shrink-0 w-[85vw] md:w-[700px] aspect-video snap-center overflow-hidden cursor-pointer transition-all"
                                onClick={() => openLightbox(i)}
                            >
                                {isVideo ? (
                                    <video 
                                        src={url} 
                                        autoPlay 
                                        muted 
                                        loop 
                                        playsInline 
                                        className="w-full h-full object-contain" 
                                    />
                                ) : (
                                    <>
                                        <Image 
                                            src={url} 
                                            alt={`${title} media ${i}`} 
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 768px) 85vw, 700px"
                                            priority={i < 2}
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                            <div className="bg-white/90 backdrop-blur text-[#1a1a1a] p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                                                <ZoomIn size={24} />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── LIGHTBOX ── */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
                        onClick={closeLightbox}
                    >
                        {/* Close Button */}
                        <button 
                            className="absolute top-6 right-6 text-white/50 hover:text-white bg-black/50 hover:bg-black p-3 rounded-full transition-all z-50"
                            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
                        >
                            <X size={28} />
                        </button>

                        {/* Prev Button */}
                        {media.length > 1 && (
                            <button 
                                className="absolute left-4 md:left-10 text-white/50 hover:text-white bg-black/50 hover:bg-black p-4 rounded-full transition-all z-50"
                                onClick={prevMedia}
                            >
                                <ChevronLeft size={36} />
                            </button>
                        )}

                        {/* Main Media Display */}
                        <div className="relative w-full h-full max-w-7xl max-h-[90vh] mx-auto p-4 md:p-12 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={lightboxIndex}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full h-full flex items-center justify-center"
                                >
                                    {(() => {
                                        const url = media[lightboxIndex];
                                        const isVideo = url.toLowerCase().match(/\.(mp4|webm|ogg)$/) || url.includes('video');
                                        return isVideo ? (
                                            <video 
                                                src={url} 
                                                controls
                                                autoPlay
                                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
                                            />
                                        ) : (
                                            <div className="relative w-full h-full">
                                                <Image 
                                                    src={url} 
                                                    alt={`${title} fullscreen`} 
                                                    fill
                                                    className="object-contain"
                                                    sizes="100vw"
                                                    priority
                                                />
                                            </div>
                                        );
                                    })()}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Next Button */}
                        {media.length > 1 && (
                            <button 
                                className="absolute right-4 md:right-10 text-white/50 hover:text-white bg-black/50 hover:bg-black p-4 rounded-full transition-all z-50"
                                onClick={nextMedia}
                            >
                                <ChevronRight size={36} />
                            </button>
                        )}
                        
                        {/* Counter */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 font-medium tracking-widest text-sm bg-black/50 px-4 py-2 rounded-full">
                            {lightboxIndex + 1} / {media.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default MediaCarousel;
