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

    // 1. Move from the right (5rem) into place (0), hold, then slightly drift away
    const x = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], ["5rem", "0rem", "0rem", "-2rem"]);
    
    // 2. Rotate from 30deg to 0deg pointing straight at the text
    const rotateZ = useTransform(scrollYProgress, [0, 0.2], [30, 0]);
    
    // 3. Fade in, stay visible, then fade out
    const opacity = useTransform(scrollYProgress, [0, 0.1, 0.8, 1], [0, 1, 1, 0]);

    return (
        <motion.div
            ref={ref}
            className="absolute right-0 top-[6rem] md:top-[8rem] w-24 md:w-48 lg:w-56 pointer-events-none"
            style={{ 
                x, 
                rotateZ, 
                opacity, 
                zIndex: 20,
                transformStyle: "preserve-3d"
            }}
        >
            <img 
                src="/pointing.png" 
                alt="Pointing Hand" 
                className="w-full h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.2)]" 
            />
        </motion.div>
    );
}
