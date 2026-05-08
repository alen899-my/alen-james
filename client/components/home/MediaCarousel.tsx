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
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 px-4 md:px-[5%] no-scrollbar pb-12">
                    {media.map((url, i) => {
                        const isVideo = url.toLowerCase().match(/\.(mp4|webm|ogg)$/) || url.includes('video');
                        
                        return (
                            <div
                                key={i}
                                className="flex-shrink-0 w-[85vw] md:w-[700px] aspect-video snap-center overflow-hidden"
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
                                    <img 
                                        src={url} 
                                        alt={`${title} media ${i}`} 
                                        className="w-full h-full object-contain" 
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

          
        </section>
    );
};

export default MediaCarousel;
