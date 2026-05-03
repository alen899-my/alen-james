'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WHY_WORK_WITH_ME } from '@/constants/why-work-with-me';

gsap.registerPlugin(ScrollTrigger);

export default function WhyWorkWithMe() {
    const containerRef = useRef<HTMLDivElement>(null);
    const bikeWrapRef = useRef<HTMLDivElement>(null);
    const contentColRef = useRef<HTMLDivElement>(null); // ← NEW

    useEffect(() => {
        const container = containerRef.current;
        const bikeWrap = bikeWrapRef.current;
        const contentCol = contentColRef.current;
        if (!container || !bikeWrap || !contentCol) return;

        // ── Standard Parallax Tracing Effect ──
        // The bike stays roughly centered in the viewport while translating down the exact height of the content.
        gsap.set(bikeWrap, {
            xPercent: -50,
            x: 45,
            y: 0,
            rotation: 0,
            opacity: 0,
            transformOrigin: '50% 50%',
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: contentCol,
                start: 'top center',
                end: 'bottom center', // Maps the animation exactly as the column passes the center of the screen
                scrub: true,
                invalidateOnRefresh: true, // Recalculate values on resize
            },
        });

        tl
            .to(bikeWrap, { opacity: 1, duration: 0.05, ease: 'none' })
            .to(bikeWrap, {
                y: () => contentCol.clientHeight, // Move down exactly the height of the column
                x: 45,
                rotation: 0,
                ease: 'none',
                duration: 0.9,
            })
            .to(bikeWrap, { opacity: 0, duration: 0.05 });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative z-10 w-full py-24 md:py-32 px-6 md:px-14 overflow-hidden bg-[var(--background)]"
        >
            <div className="max-w-7xl mx-auto relative">
                <h2
                    className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-24 md:mb-32"
                    style={{ fontFamily: '"Patrick Hand SC", cursive', color: 'var(--page-text)' }}
                >
                    Why Work With Me?
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">

                    {/* ── Bike Column ── */}
                    <div className="hidden lg:block lg:col-span-4 relative order-1">

                        {/* Dashed rail — full column height */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-black/25 z-0" />

                        <div
                            ref={bikeWrapRef}
                            className="absolute z-10"
                            style={{ top: 0, left: '50%' }}
                        >
                            <img
                                src="/scrollimage -rotated.png"
                                alt="Bike rider"
                                className="w-44 h-auto object-contain relative z-10"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* ── Content Column ── */}
                    <div
                        ref={contentColRef} 
                        className="lg:col-span-8 space-y-24 md:space-y-32 order-2"
                    >
                        {WHY_WORK_WITH_ME.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-100px' }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className="relative group"
                            >
                                <div className="flex items-start gap-4 md:gap-8">
                                    <span
                                        className="text-xl md:text-3xl font-bold mt-2"
                                        style={{ fontFamily: '"Patrick Hand SC", cursive', color: 'var(--page-text)' }}
                                    >
                                        {item.id}
                                    </span>
                                    <div>
                                        <h3
                                            className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-6"
                                            style={{ fontFamily: '"Patrick Hand SC", cursive', color: '#1084a2' }}
                                        >
                                            {item.title}
                                        </h3>
                                        <p className="text-lg md:text-xl font-medium leading-tight max-w-2xl text-[#2d2a21]/80">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>

            {/* ── Mobile float ── */}
            <div className="lg:hidden mt-16 flex justify-center">
                <motion.img
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    src="/scrollimage.png"
                    alt="Bike rider"
                    className="w-40 h-auto object-contain opacity-50"
                />
            </div>
        </section>
    );
}