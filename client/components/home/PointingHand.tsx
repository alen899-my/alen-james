'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function PointingHand() {
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Combine into single x transform — avoids 3 separate derived values on scroll
    const x = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], ["30rem", "0rem", "0rem", "30rem"]);
    const rotateZ = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [45, 0, 0, -45]);
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
                willChange: 'transform, opacity',
            }}
        >
            <img
                src="/pointing.png"
                alt=""
                aria-hidden="true"
                width={512}
                height={512}
                className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                style={{ filter: 'brightness(1.05)' }}
            />
        </motion.div>
    );
}
