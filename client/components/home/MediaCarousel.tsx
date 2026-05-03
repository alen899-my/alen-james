'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MediaCarouselProps {
    media: string[];
    title: string;
}

const MediaCarousel = ({ media, title }: MediaCarouselProps) => {
    return (
        <section className="py-12 overflow-hidden bg-[var(--background)]">
            <div className="relative w-full">
                {/* Horizontal Scrolling Container */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-8 md:gap-12 px-6 md:px-[15%] no-scrollbar pb-12">
                    {media.map((url, i) => {
                        const isVideo = url.toLowerCase().match(/\.(mp4|webm|ogg)$/) || url.includes('video');
                        
                        return (
                            <div
                                key={i}
                                className="flex-shrink-0 w-[85vw] md:w-[700px] aspect-video snap-center bg-[var(--card)] border border-[var(--accent)]/20 rounded-2xl overflow-hidden shadow-lg"
                            >
                                {isVideo ? (
                                    <video 
                                        src={url} 
                                        autoPlay 
                                        muted 
                                        loop 
                                        playsInline 
                                        className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    <img 
                                        src={url} 
                                        alt={`${title} media ${i}`} 
                                        className="w-full h-full object-cover" 
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Simple Progress Bar or Label */}
            <div className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-[var(--muted-foreground)]">
                Scroll to explore projects
            </div>
        </section>
    );
};

export default MediaCarousel;
