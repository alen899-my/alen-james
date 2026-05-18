'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const WORD_DELAY = 1.2;
const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;
const IS_LOW_END_DEVICE = typeof navigator !== 'undefined' && 
  ((navigator as any).deviceMemory < 4 || (navigator as any).hardwareConcurrency < 4);

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);

    // ── Framer Motion Scroll Hooks (DISABLED on mobile/low-end) ──
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });
    
    // Skip scroll animations on mobile and low-end devices
    const shouldDisableScrollAnimations = IS_MOBILE || IS_LOW_END_DEVICE;
    
    const w1Opacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [1, 1, shouldDisableScrollAnimations ? 1 : 0]);
    const w1Y = useTransform(scrollYProgress, [0, 0.6], [0, shouldDisableScrollAnimations ? 0 : -80]);
    
    const w2Opacity = useTransform(scrollYProgress, [0, 0.4, 0.7], [1, 1, shouldDisableScrollAnimations ? 1 : 0]);
    const w2Y = useTransform(scrollYProgress, [0, 0.7], [0, shouldDisableScrollAnimations ? 0 : -80]);
    
    const w3Opacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 1, shouldDisableScrollAnimations ? 1 : 0]);
    const w3Y = useTransform(scrollYProgress, [0, 0.8], [0, shouldDisableScrollAnimations ? 0 : -80]);
    
    const w4Opacity = useTransform(scrollYProgress, [0, 0.6, 0.9], [1, 1, shouldDisableScrollAnimations ? 1 : 0]);
    const w4Y = useTransform(scrollYProgress, [0, 0.9], [0, shouldDisableScrollAnimations ? 0 : -80]);

    const bgRef = useRef<HTMLDivElement>(null);
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
                audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
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

            gsap.set(bgRef.current, { scale: 1.15, opacity: 0 });
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

            // ── SKIP ScrollTrigger on mobile/low-end devices ──
            if (!shouldDisableScrollAnimations) {
                ScrollTrigger.create({
                    trigger: aboutSection || document.body,
                    start: aboutSection ? 'top bottom' : 'top top',
                    end: aboutSection ? 'top top' : '+=1000',
                    scrub: 1.4,
                    onUpdate(self) {
                        const p = self.progress;
                        gsap.set(bgRef.current, { 
                            scale: 1.15 - p * 0.15,
                            y: p * 100,
                            opacity: p * 0.5,
                            filter: 'blur(2px)'
                        });

                        if (!bikeExited && bikeRef.current) {
                            const vw = window.innerWidth;
                            const bikeW = bikeRef.current.offsetWidth;
                            const endX = vw - bikeW - 16;
                            gsap.set(bikeRef.current, { 
                                x: endX + p * 1500,
                                opacity: Math.max(0, 1 - p * 1.5)
                            });
                        }
                    },
                });
            }

            // ─── SMOKE SETUP ────────────────────────────────────────────────
            const smokeTweens: gsap.core.Tween[] = [];

            // Skip smoke on low-end devices
            if (!IS_LOW_END_DEVICE) {
                const startRushingSmoke = () => {
                    if (!smokeRef.current) return;
                    const puffs = gsap.utils.toArray('.smoke-puff', smokeRef.current);
                    puffs.forEach((puff: any, i: number) => {
                        const t = gsap.fromTo(puff,
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
                        smokeTweens.push(t);
                    });
                };
                startRushingSmoke();
            }

            // ─── BIKE RIDE-THROUGH (SKIP ON MOBILE) ────────────────────────────────────────────
            if (!IS_MOBILE && bikeRef.current && bikeImgRef.current) {
                const bike = bikeRef.current;
                const bikeImg = bikeImgRef.current;
                const vw = window.innerWidth;

                const bikeTl = gsap.timeline({ delay: 0.2 });

                bikeTl.fromTo(bike,
                    { x: -300 },
                    {
                        x: vw * 0.15,
                        duration: 0.5,
                        ease: "expo.out",
                    }
                );

                bikeTl.fromTo(bikeImg,
                    { rotate: 0, transformOrigin: "80% 100%" },
                    {
                        rotate: -14,
                        duration: 0.4,
                        ease: "power3.out",
                    },
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
        }, containerRef);

        return () => {
            ctx.revert();
        };
    }, [shouldDisableScrollAnimations]);

    return (
        <section
            ref={containerRef}
            className="min-h-screen w-full flex items-center justify-center md:justify-start px-6 md:px-14 relative overflow-x-hidden"
            style={{ perspective: IS_MOBILE ? 'none' : '800px' }}
        >

            {/* BG layers */}
            <div className="absolute inset-0 overflow-hidden z-0 bg-[var(--background)]">
                {/* Background image - simplified on mobile */}
                <div
                    ref={bgRef}
                    className="absolute inset-0 bg-no-repeat bg-center bg-cover"
                    style={{
                        backgroundImage: 'url("/scrollimage3.png")',
                        willChange: IS_MOBILE ? 'auto' : 'transform, opacity, filter',
                        filter: IS_MOBILE ? 'blur(8px)' : 'blur(4px) brightness(1.1) contrast(1.1)',
                        contain: 'paint',
                    }}
                />
                
                {/* Simplified overlay on mobile */}
                {!IS_MOBILE && (
                    <div
                        ref={bgOverlayRef}
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `
                                radial-gradient(circle at 15% 25%, color-mix(in srgb, var(--accent) 12%, transparent) 0%, transparent 45%),
                                radial-gradient(circle at 85% 75%, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 45%),
                                linear-gradient(to bottom, transparent 20%, var(--background) 100%)
                            `,
                        }}
                    />
                )}
                
                {/* Global vignette */}
                {!IS_MOBILE && (
                    <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle at center, transparent 0%, color-mix(in srgb, var(--background) 20%, transparent) 100%)',
                        }}
                    />
                )}
            </div>

            {/* Heading */}
            <div
                className="flex flex-col items-center text-center w-full"
                style={{ position: 'relative', zIndex: 10 }}
            >
                <h1
                    className="flex flex-col items-center gap-0 font-bold"
                    aria-label="SomeBody who can Build"
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
                                            paddingRight: '0.1em',
                                            contain: 'layout style paint'
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
                                            paddingRight: '0.1em',
                                            contain: 'layout style paint'
                                        }}
                                    >
                                        {word}
                                    </span>
                                </motion.span>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Layout - NO SCROLL ANIMATIONS */}
                    <div className="flex md:hidden flex-col items-center gap-0">
                        <div className="overflow-hidden py-1 px-4 -my-1">
                            <motion.span 
                                className="inline-block overflow-hidden pb-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <span
                                    ref={(el) => { if (el) wordRefs.current[4] = el; }}
                                    className="inline-block text-[var(--foreground)] tracking-tight uppercase"
                                    style={{
                                        fontFamily: '"Patrick Hand SC", cursive',
                                        fontSize: 'clamp(3.2rem, 18vw, 5.5rem)',
                                        willChange: 'auto',
                                        lineHeight: 1.2,
                                        paddingRight: '0.1em',
                                        contain: 'layout style paint'
                                    }}
                                >
                                    Jack
                                </span>
                            </motion.span>
                        </div>
                        <div className="flex justify-center overflow-hidden py-1 px-4 -my-1">
                            <motion.span 
                                className="inline-block overflow-hidden mr-[0.5em] pb-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
                                <span
                                    ref={(el) => { if (el) wordRefs.current[5] = el; }}
                                    className="inline-block text-[var(--foreground)] tracking-tight uppercase"
                                    style={{
                                        fontFamily: '"Patrick Hand SC", cursive',
                                        fontSize: 'clamp(3.2rem, 18vw, 5.5rem)',
                                        willChange: 'auto',
                                        lineHeight: 1.2,
                                        paddingRight: '0.1em',
                                        contain: 'layout style paint'
                                    }}
                                >
                                    of
                                </span>
                            </motion.span>
                            <motion.span 
                                className="inline-block overflow-hidden pb-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <span
                                    ref={(el) => { if (el) wordRefs.current[6] = el; }}
                                    className="inline-block text-[var(--accent)] tracking-tight uppercase"
                                    style={{
                                        fontFamily: '"Patrick Hand SC", cursive',
                                        fontSize: 'clamp(3.2rem, 18vw, 5.5rem)',
                                        willChange: 'auto',
                                        lineHeight: 1.2,
                                        paddingRight: '0.1em',
                                        contain: 'layout style paint'
                                    }}
                                >
                                    all
                                </span>
                            </motion.span>
                        </div>
                        <div className="overflow-hidden py-1 px-4 -my-1">
                            <motion.span 
                                className="inline-block overflow-hidden pb-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <span
                                    ref={(el) => { if (el) wordRefs.current[7] = el; }}
                                    className="inline-block text-[var(--accent)] tracking-tight uppercase"
                                    style={{
                                        fontFamily: '"Patrick Hand SC", cursive',
                                        fontSize: 'clamp(3.2rem, 18vw, 5.5rem)',
                                        willChange: 'auto',
                                        lineHeight: 1.2,
                                        paddingRight: '0.1em',
                                        contain: 'layout style paint'
                                    }}
                                >
                                    trade
                                </span>
                            </motion.span>
                        </div>
                    </div>
                </h1>
            </div>

            {/* Bike + Smoke - HIDDEN ON MOBILE */}
            {!IS_MOBILE && (
                <div
                    ref={bikeRef}
                    onClick={handleBikeClick}
                    className="absolute bottom-10 left-0 flex items-end cursor-pointer group"
                    style={{ zIndex: 15 }}
                >
                    {!IS_LOW_END_DEVICE && (
                        <svg
                            ref={smokeRef}
                            width="120"
                            height="100"
                            className="absolute -left-16 bottom-0 pointer-events-none"
                            viewBox="0 0 120 100"
                            style={{ zIndex: 0 }}
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
                    )}
                    
                    <audio ref={audioRef} src="/bikesound.mp3" preload="none" loop />

                    <img
                        ref={bikeImgRef}
                        src="/scrollimage.png"
                        alt="Bike riding"
                        className="w-40 md:w-56 h-auto object-contain relative transition-all duration-200 group-hover:brightness-110 group-active:scale-95"
                        style={{ zIndex: 10, transformOrigin: '50% 100%' }}
                        loading="lazy"
                    />
                </div>
            )}

            {/* Scroll Indicator - SIMPLIFIED ON MOBILE */}
            <motion.div 
                className="absolute bottom-20 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5, duration: 1 }}
                style={{ opacity: IS_MOBILE ? 0.5 : w4Opacity }}
            >
                <motion.div 
                    className="w-14 h-14 rounded-full bg-[var(--accent)] text-white flex items-center justify-center group cursor-pointer hover:scale-110 transition-all shadow-[0_4px_14px_rgba(16,132,162,0.3)]"
                    animate={IS_MOBILE ? {} : { y: [0, 10, 0] }}
                    transition={IS_MOBILE ? {} : { repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    onClick={() => {
                        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    <ArrowDown size={24} className="group-hover:scale-110 transition-transform" />
                </motion.div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Scroll</span>
            </motion.div>
        </section>
    );
}
