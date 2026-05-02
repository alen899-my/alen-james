'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function PointingHand() {
    const ref = useRef<HTMLDivElement>(null);
    
    // Track the scroll progress of this element relative to the viewport
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"] 
        // "start end" = 0 (when top of element hits bottom of screen)
        // "end start" = 1 (when bottom of element hits top of screen)
    });

    // 1. Move from far right (30rem) into place (0), hold, then slide back out to right (30rem)
    const x = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], ["30rem", "0rem", "0rem", "30rem"]);
    
    // 2. Dynamic rotation: tilts as it enters, points straight, then tilts as it leaves
    const rotateZ = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [45, 0, 0, -45]);
    
    // 3. Fade in and out
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.7, 1], [0, 1, 1, 0]);

    return (
        <motion.div
            ref={ref}
            className="hidden md:block absolute right-0 top-[15rem] md:top-[12rem] lg:top-[10rem] w-32 md:w-64 lg:w-[32rem] pointer-events-none"
            style={{ 
                x, 
                rotateZ, 
                opacity, 
                zIndex: 25,
                transformStyle: "preserve-3d"
            }}
        >
            <img 
                src="/pointing.png" 
                alt="Pointing Hand" 
                className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]" 
                style={{ filter: 'brightness(1.05)' }}
            />
        </motion.div>
    );
}
