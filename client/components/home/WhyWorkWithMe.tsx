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

        // ── Curved Path Tracking ──
        // The bike enters from the left, curves 90 degrees, and rides down.
        // We offset x and y so the wheels perfectly touch the dashed line.
        gsap.set(bikeWrap, {
            xPercent: -50,
            yPercent: -50,
            x: -400,       // Start just off the left edge
            y: -65,        // Shifted up so massive wheels touch the horizontal line
            rotation: 0,   // Facing right
            opacity: 1,    // Always visible
            transformOrigin: '50% 50%',
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: contentCol,
                start: 'top center',
                end: 'bottom center', // Stays centered in viewport during animation
                scrub: true,
                invalidateOnRefresh: true,
            },
        });

        tl
            // 1. Move horizontally into view VERY quickly (First 5% of scroll)
            .to(bikeWrap, { x: -100, ease: 'power2.out', duration: 0.05 })

            // 2. The Curve! (Next 5% of scroll)
            .addLabel("curve")
            .to(bikeWrap, { x: 65, ease: 'sine.out', duration: 0.05 }, "curve")
            .to(bikeWrap, { y: 100, ease: 'sine.in', duration: 0.05 }, "curve")
            .to(bikeWrap, { rotation: 90, ease: 'sine.inOut', duration: 0.05 }, "curve")

            // 3. Straight down the vertical rail (Spends 90% of scroll here!)
            .addLabel("down")
            .to(bikeWrap, { y: () => contentCol.clientHeight + 200, ease: 'none', duration: 0.90 }, "down");

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
                    style={{ fontFamily: '"Patrick Hand SC", cursive', color: 'var(--foreground)' }}
                >
                    Why Work With Me?
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">

                    {/* ── Bike Column ── */}
                    <div className="hidden lg:block lg:col-span-4 relative order-1">

                        {/* Dashed rail — Horizontal from left, curved corner, straight down */}
                        <div
                            className="absolute bottom-0 border-t-2 border-r-2 border-dashed border-[var(--foreground)]/20 rounded-tr-[100px] z-0"
                            style={{ top: 0, right: '50%', width: '100vw' }}
                        />

                        <div
                            ref={bikeWrapRef}
                            className="absolute z-10"
                            style={{ top: 0, left: '50%' }}
                        >
                            <img
                                src="/scrollimage.png"
                                alt="Bike rider"
                                className="w-[336px] h-auto object-contain relative z-10"
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
                                        style={{ fontFamily: '"Patrick Hand SC", cursive', color: 'var(--foreground)' }}
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
                                        <p className="text-lg md:text-xl font-medium leading-tight max-w-2xl text-[var(--muted-foreground)]">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>

        </section>
    );
}