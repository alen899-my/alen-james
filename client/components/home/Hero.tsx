'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const WORD_DELAY = 1.2;

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);

    // ── Framer Motion Scroll (only for word fade-out) ──
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const w1Opacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [1, 1, 0]);
    const w1Y = useTransform(scrollYProgress, [0, 0.6], [0, -80]);
    const w2Opacity = useTransform(scrollYProgress, [0, 0.4, 0.7], [1, 1, 0]);
    const w2Y = useTransform(scrollYProgress, [0, 0.7], [0, -80]);
    const w3Opacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 1, 0]);
    const w3Y = useTransform(scrollYProgress, [0, 0.8], [0, -80]);
    const w4Opacity = useTransform(scrollYProgress, [0, 0.6, 0.9], [1, 1, 0]);
    const w4Y = useTransform(scrollYProgress, [0, 0.9], [0, -80]);

    const bgOverlayRef = useRef<HTMLDivElement>(null);
    const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const bikeRef = useRef<HTMLDivElement>(null);
    const smokeRef = useRef<SVGSVGElement>(null);
    const bikeImgRef = useRef<HTMLImageElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const handleBikeClick = () => {
        if (audioRef.current) {
            if (audioRef.current.paused) {
                audioRef.current.volume = 0.5;
                audioRef.current.play().catch(() => {});
            } else {
                audioRef.current.pause();
            }
        }
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            const words = wordRefs.current.filter(Boolean);

            gsap.set(words, {
                yPercent: 110,
                rotate: 5,
                opacity: 0,
                transformOrigin: "left top"
            });

            gsap.set(bgOverlayRef.current, { opacity: 0 });

            if (bikeRef.current) {
                gsap.set(bikeRef.current, { xPercent: -100, x: 0 });
            }

            const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

            tl.to(bgOverlayRef.current, {
                opacity: 1,
                duration: 2.5,
                ease: "power2.out"
            }, 0);

            tl.to(words, {
                yPercent: 0,
                rotate: 0,
                opacity: 1,
                duration: 1.4,
                stagger: 0.08,
                ease: "power4.out",
            }, WORD_DELAY);

            if (words.length > 0) {
                tl.to(words[words.length - 1], {
                    scale: 1.05,
                    duration: 0.3,
                    ease: 'power2.out',
                    yoyo: true,
                    repeat: 1
                }, "-=0.8");
            }

            const aboutSection = document.getElementById('about');

            let bikeExited = false;
            // Cache layout values once — avoids thrashing inside scroll listener
            let cachedVW = window.innerWidth;
            let cachedBikeW = bikeRef.current ? bikeRef.current.offsetWidth : 200;

            const handleResize = () => {
                cachedVW = window.innerWidth;
                cachedBikeW = bikeRef.current ? bikeRef.current.offsetWidth : 200;
            };
            window.addEventListener('resize', handleResize, { passive: true });

            ScrollTrigger.create({
                trigger: aboutSection || document.body,
                start: aboutSection ? 'top bottom' : 'top top',
                end: aboutSection ? 'top top' : '+=1000',
                scrub: 1.2,
                onUpdate(self) {
                    const p = self.progress;

                    if (!bikeExited && bikeRef.current) {
                        const endX = cachedVW - cachedBikeW - 16;
                        gsap.set(bikeRef.current, {
                            x: endX + p * 1500,
                            opacity: Math.max(0, 1 - p * 1.5)
                        });
                    }
                },
            });

            // ─── SMOKE — only on desktop (reduce mobile GPU load) ───────────────
            const isDesktop = window.matchMedia('(min-width: 768px)').matches;
            if (isDesktop && smokeRef.current) {
                const puffs = gsap.utils.toArray('.smoke-puff', smokeRef.current);
                puffs.forEach((puff: any, i: number) => {
                    gsap.fromTo(puff,
                        { opacity: 0.9, scale: 0.5, x: 0, y: 0 },
                        {
                            opacity: 0,
                            scale: 2.5 + Math.random(),
                            x: -60 - Math.random() * 60,
                            y: -10 - Math.random() * 30,
                            duration: 0.6 + Math.random() * 0.4,
                            repeat: -1,
                            delay: i * 0.15,
                            ease: "power2.out"
                        }
                    );
                });
            }

            // ─── BIKE RIDE-THROUGH ────────────────────────────────────────────
            if (bikeRef.current && bikeImgRef.current) {
                const bike = bikeRef.current;
                const bikeImg = bikeImgRef.current;
                const vw = cachedVW;

                const bikeTl = gsap.timeline({ delay: 0.2 });

                bikeTl.fromTo(bike,
                    { x: -300 },
                    { x: vw * 0.15, duration: 0.5, ease: "expo.out" }
                );

                bikeTl.fromTo(bikeImg,
                    { rotate: 0, transformOrigin: "80% 100%" },
                    { rotate: -14, duration: 0.4, ease: "power3.out" },
                    "<"
                );

                bikeTl.to(bike, {
                    x: vw * 0.7,
                    duration: 2.2,
                    ease: "power1.inOut",
                });

                bikeTl.to(bikeImg, {
                    rotate: 4,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.5)",
                }, "<");

                bikeTl.to(bikeImg, {
                    y: -6,
                    duration: 0.18,
                    ease: "power2.out",
                    yoyo: true,
                    repeat: 6,
                }, "<0.2");

                bikeTl.to(bikeImg, {
                    skewX: 1.5,
                    duration: 0.12,
                    ease: "none",
                    yoyo: true,
                    repeat: 10,
                }, "<");

                bikeTl.to(bikeImg, {
                    rotate: -8,
                    y: -4,
                    duration: 0.2,
                    ease: "power3.out",
                });

                bikeTl.to(bike, {
                    x: vw + 400,
                    duration: 0.6,
                    ease: "power3.in",
                    onComplete: () => {
                        bikeExited = true;
                        if (bikeRef.current) {
                            gsap.set(bikeRef.current, { display: 'none' });
                        }
                    }
                }, "<0.1");
            }

            return () => {
                window.removeEventListener('resize', handleResize);
            };

        }, containerRef);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <section
            ref={containerRef}
            className="min-h-screen w-full flex items-center justify-center md:justify-start px-6 md:px-14 relative overflow-x-hidden"
            style={{ perspective: '800px' }}
        >

            {/* Aurora Background */}
            <div ref={bgOverlayRef} className="absolute inset-0 overflow-hidden z-0">
                <div
                    className="absolute inset-0"
                    style={{
                        "--aurora": "repeating-linear-gradient(100deg,#3b82f6_10%,#a5b4fc_15%,#93c5fd_20%,#ddd6fe_25%,#60a5fa_30%)",
                        "--dark-gradient": "repeating-linear-gradient(100deg,#000_0%,#000_7%,transparent_10%,transparent_12%,#000_16%)",
                        "--white-gradient": "repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%)",
                        "--blue-300": "#93c5fd",
                        "--blue-400": "#60a5fa",
                        "--blue-500": "#3b82f6",
                        "--indigo-300": "#a5b4fc",
                        "--violet-200": "#ddd6fe",
                        "--black": "#000",
                        "--white": "#fff",
                        "--transparent": "transparent",
                    } as React.CSSProperties}
                >
                    <div
                        className="after:animate-aurora pointer-events-none absolute -inset-[10px] [background-image:var(--white-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%] opacity-50 blur-[10px] invert filter will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)] [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:fixed] after:mix-blend-difference after:content-[''] dark:[background-image:var(--dark-gradient),var(--aurora)] dark:invert-0 after:dark:[background-image:var(--dark-gradient),var(--aurora)] [mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]"
                    />
                </div>
            </div>

            {/* Heading */}
            <div
                className="flex flex-col items-center text-center w-full"
                style={{ position: 'relative', zIndex: 10 }}
            >
                <h1
                    className="flex flex-col items-center gap-0 font-bold"
                    aria-label="Jack of all trade"
                >
                    {/* Desktop Layout */}
                    <div className="hidden md:flex flex-col items-center gap-0">
                        <div className="flex flex-wrap justify-center overflow-hidden py-2 px-4 -my-2">
                            {["Jack", "of"].map((word, i) => (
                                <motion.span
                                    key={i}
                                    className="inline-block overflow-hidden mr-[0.6em] last:mr-0 pb-2"
                                    style={{ opacity: i === 0 ? w1Opacity : w2Opacity, y: i === 0 ? w1Y : w2Y }}
                                >
                                    <span
                                        ref={(el) => { wordRefs.current[i] = el; }}
                                        className="inline-block text-[var(--foreground)] tracking-tight uppercase"
                                        style={{
                                            fontFamily: '"Patrick Hand SC", cursive',
                                            fontSize: 'clamp(3.5rem, 10vw, 8rem)',
                                            willChange: 'transform, opacity',
                                            lineHeight: 1.1,
                                            paddingRight: '0.1em'
                                        }}
                                    >
                                        {word}
                                    </span>
                                </motion.span>
                            ))}
                        </div>
                        <div className="flex flex-wrap justify-center overflow-hidden py-2 px-4 -my-2">
                            {["all", "trade"].map((word, i) => (
                                <motion.span
                                    key={i}
                                    className="inline-block overflow-hidden mr-[0.6em] last:mr-0 pb-2"
                                    style={{ opacity: i === 0 ? w3Opacity : w4Opacity, y: i === 0 ? w3Y : w4Y }}
                                >
                                    <span
                                        ref={(el) => { wordRefs.current[i + 2] = el; }}
                                        className="inline-block text-[var(--accent)] tracking-tight uppercase"
                                        style={{
                                            fontFamily: '"Patrick Hand SC", cursive',
                                            fontSize: 'clamp(3.5rem, 10vw, 8rem)',
                                            willChange: 'transform, opacity',
                                            lineHeight: 1.1,
                                            paddingRight: '0.1em'
                                        }}
                                    >
                                        {word}
                                    </span>
                                </motion.span>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="flex md:hidden flex-col items-center gap-0">
                        <div className="overflow-hidden py-1 px-4 -my-1">
                            <motion.span
                                className="inline-block overflow-hidden pb-2"
                                style={{ opacity: w1Opacity, y: w1Y }}
                            >
                                <span
                                    ref={(el) => { if (el) wordRefs.current[4] = el; }}
                                    className="inline-block text-[var(--foreground)] tracking-tight uppercase"
                                    style={{
                                        fontFamily: '"Patrick Hand SC", cursive',
                                        fontSize: 'clamp(3.2rem, 18vw, 5.5rem)',
                                        willChange: 'transform, opacity',
                                        lineHeight: 1.2,
                                        paddingRight: '0.1em'
                                    }}
                                >
                                    Jack
                                </span>
                            </motion.span>
                        </div>
                        <div className="flex justify-center overflow-hidden py-1 px-4 -my-1">
                            <motion.span
                                className="inline-block overflow-hidden mr-[0.5em] pb-2"
                                style={{ opacity: w2Opacity, y: w2Y }}
                            >
                                <span
                                    ref={(el) => { if (el) wordRefs.current[5] = el; }}
                                    className="inline-block text-[var(--foreground)] tracking-tight uppercase"
                                    style={{
                                        fontFamily: '"Patrick Hand SC", cursive',
                                        fontSize: 'clamp(3.2rem, 18vw, 5.5rem)',
                                        willChange: 'transform, opacity',
                                        lineHeight: 1.2,
                                        paddingRight: '0.1em'
                                    }}
                                >
                                    of
                                </span>
                            </motion.span>
                            <motion.span
                                className="inline-block overflow-hidden pb-2"
                                style={{ opacity: w3Opacity, y: w3Y }}
                            >
                                <span
                                    ref={(el) => { if (el) wordRefs.current[6] = el; }}
                                    className="inline-block text-[var(--accent)] tracking-tight uppercase"
                                    style={{
                                        fontFamily: '"Patrick Hand SC", cursive',
                                        fontSize: 'clamp(3.2rem, 18vw, 5.5rem)',
                                        willChange: 'transform, opacity',
                                        lineHeight: 1.2,
                                        paddingRight: '0.1em'
                                    }}
                                >
                                    all
                                </span>
                            </motion.span>
                        </div>
                        <div className="overflow-hidden py-1 px-4 -my-1">
                            <motion.span
                                className="inline-block overflow-hidden pb-2"
                                style={{ opacity: w4Opacity, y: w4Y }}
                            >
                                <span
                                    ref={(el) => { if (el) wordRefs.current[7] = el; }}
                                    className="inline-block text-[var(--accent)] tracking-tight uppercase"
                                    style={{
                                        fontFamily: '"Patrick Hand SC", cursive',
                                        fontSize: 'clamp(3.2rem, 18vw, 5.5rem)',
                                        willChange: 'transform, opacity',
                                        lineHeight: 1.2,
                                        paddingRight: '0.1em'
                                    }}
                                >
                                    trade
                                </span>
                            </motion.span>
                        </div>
                    </div>
                </h1>
            </div>

            {/* Bike + Smoke */}
            <div
                ref={bikeRef}
                onClick={handleBikeClick}
                className="absolute bottom-10 left-0 flex items-end cursor-pointer group"
                style={{ zIndex: 15, willChange: 'transform, opacity' }}
            >
                <svg
                    ref={smokeRef}
                    width="120"
                    height="100"
                    className="absolute -left-16 bottom-0 pointer-events-none hidden md:block"
                    viewBox="0 0 120 100"
                    style={{ zIndex: 0 }}
                    aria-hidden="true"
                >
                    <defs>
                        <filter id="smokeBlur">
                            <feGaussianBlur stdDeviation="4" />
                        </filter>
                    </defs>
                    <circle className="smoke-puff" cx="100" cy="80" r="10" fill="#94a3b8" filter="url(#smokeBlur)" />
                    <circle className="smoke-puff" cx="100" cy="80" r="14" fill="#cbd5e1" filter="url(#smokeBlur)" />
                    <circle className="smoke-puff" cx="100" cy="80" r="12" fill="#64748b" filter="url(#smokeBlur)" />
                    <circle className="smoke-puff" cx="100" cy="80" r="16" fill="#94a3b8" filter="url(#smokeBlur)" />
                </svg>

                {/* Audio — lazy preload so it doesn't block initial render */}
                <audio ref={audioRef} src="/bikesound.mp3" preload="none" loop />

                <img
                    ref={bikeImgRef}
                    src="/scrollimage.png"
                    alt="Bike riding"
                    width={224}
                    height={150}
                    className="w-40 md:w-56 h-auto object-contain relative"
                    style={{ zIndex: 10, transformOrigin: '50% 100%' }}
                />
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-20 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5, duration: 1 }}
                style={{ opacity: w4Opacity }}
            >
                <motion.div
                    className="w-14 h-14 rounded-full bg-[var(--accent)] text-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-[0_4px_14px_rgba(16,132,162,0.4)]"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    onClick={() => {
                        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    <ArrowDown size={24} />
                </motion.div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Scroll</span>
            </motion.div>
        </section>
    );
}
