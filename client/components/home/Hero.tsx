'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useTransform } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const WORD_DELAY = 1.2;

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);

    // ── Framer Motion Scroll Hooks ──
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });
    
    // Controlled, smooth fade out tied exactly to the scroll progress as the 'About' section comes up.
    // Staggering the fade out so they disappear smoothly.
    const w1Opacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [1, 1, 0]);
    const w1Y = useTransform(scrollYProgress, [0, 0.6], [0, -80]);
    
    const w2Opacity = useTransform(scrollYProgress, [0, 0.4, 0.7], [1, 1, 0]);
    const w2Y = useTransform(scrollYProgress, [0, 0.7], [0, -80]);
    
    const w3Opacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 1, 0]);
    const w3Y = useTransform(scrollYProgress, [0, 0.8], [0, -80]);
    
    const w4Opacity = useTransform(scrollYProgress, [0, 0.6, 0.9], [1, 1, 0]);
    const w4Y = useTransform(scrollYProgress, [0, 0.9], [0, -80]);

    const bgRef = useRef<HTMLDivElement>(null);
    const bgOverlayRef = useRef<HTMLDivElement>(null);
    const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const bikeRef = useRef<HTMLDivElement>(null);
    const smokeRef = useRef<SVGSVGElement>(null);
    // New refs for sub-parts of the bike for physics animation
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

            ScrollTrigger.create({
                trigger: aboutSection || document.body,
                start: aboutSection ? 'top bottom' : 'top top',
                end: aboutSection ? 'top top' : '+=1000',
                scrub: 1.4,
                onUpdate(self) {
                    const p = self.progress;
                    // Background scale/fade
                    gsap.set(bgRef.current, { scale: 1.15 - p * 0.15, opacity: p });
                    gsap.set(bgOverlayRef.current, { opacity: p * 0.75 });

                    // 2. Bike goes out of screen (accelerates right)
                    if (bikeRef.current) {
                        const endX = document.body.clientWidth - 24;
                        gsap.set(bikeRef.current, { 
                            x: endX + p * 1500, // aggressive blast off to the right
                            opacity: Math.max(0, 1 - p * 1.5)
                        });
                    }
                },
            });

            // ─── SMOKE SETUP ────────────────────────────────────────────────
            const smokeTweens: gsap.core.Tween[] = [];

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

            const startIdlingSmoke = () => {
                if (!smokeRef.current) return;
                const puffs = gsap.utils.toArray('.smoke-puff', smokeRef.current);
                puffs.forEach((puff: any, i: number) => {
                    gsap.fromTo(puff,
                        { opacity: 0.6, scale: 0.5, x: 0, y: 0 },
                        {
                            opacity: 0,
                            scale: 1.5 + Math.random(),
                            x: -10 - Math.random() * 15,
                            y: -20 - Math.random() * 20,
                            duration: 1.5 + Math.random(),
                            repeat: -1,
                            delay: i * 0.4,
                            ease: "power1.out"
                        }
                    );
                });
            };

            startRushingSmoke();

            // ─── BIKE PHYSICS ────────────────────────────────────────────────
            if (bikeRef.current && bikeImgRef.current) {
                const bike = bikeRef.current;
                const bikeImg = bikeImgRef.current;
                const endX = document.body.clientWidth - 24;

                const bikeTl = gsap.timeline({ delay: 0.2 });

                // ── Phase 1: LAUNCH — wheelie-like tilt on hard acceleration

                // ── Phase 1: LAUNCH — wheelie-like tilt on hard acceleration
                bikeTl.fromTo(bike,
                    { x: -300 },
                    {
                        x: endX * 0.15,
                        duration: 0.5,
                        ease: "expo.out",
                    }
                );

                // Simultaneous launch lean — nose up like hard throttle
                bikeTl.fromTo(bikeImg,
                    { rotate: 0, transformOrigin: "80% 100%" },
                    {
                        rotate: -14,
                        duration: 0.4,
                        ease: "power3.out",
                    },
                    "<"
                );

                // ── Phase 2: CRUISE — main travel, nose comes down, body bobs
                bikeTl.to(bike, {
                    x: endX * 0.88,
                    duration: 2.6,
                    ease: "power1.inOut",
                });

                // Nose settles back + slight forward lean during cruise
                bikeTl.to(bikeImg, {
                    rotate: 4,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.5)",
                }, "<");

                // Road bump bounce — vertical oscillation during cruise
                bikeTl.to(bikeImg, {
                    y: -6,
                    duration: 0.18,
                    ease: "power2.out",
                    yoyo: true,
                    repeat: 7,
                }, "<0.2");

                // Random micro-wobble on handlebar (rotate oscillation)
                bikeTl.to(bikeImg, {
                    skewX: 1.5,
                    duration: 0.12,
                    ease: "none",
                    yoyo: true,
                    repeat: 13,
                }, "<");

                // ── Phase 3: POTHOLE — one big dramatic bump mid-journey
                bikeTl.to(bikeImg, {
                    y: -22,
                    rotate: -8,
                    duration: 0.15,
                    ease: "power4.out",
                }, "<1.0");

                bikeTl.to(bikeImg, {
                    y: 4,
                    rotate: 6,
                    duration: 0.22,
                    ease: "bounce.out",
                }, ">");

                bikeTl.to(bikeImg, {
                    y: 0,
                    rotate: 4,
                    skewX: 0,
                    duration: 0.3,
                    ease: "elastic.out(1, 0.4)",
                }, ">");

                // ── Phase 4: BRAKING SKID — overshoot + snap back (funny)
                bikeTl.to(bike, {
                    x: endX + 55, // overshoot past stop point
                    duration: 0.35,
                    ease: "power2.in",
                });

                // Front dips hard on braking
                bikeTl.to(bikeImg, {
                    rotate: -12,
                    y: -8,
                    duration: 0.25,
                    ease: "power3.out",
                }, "<");

                // Snap back to stop
                bikeTl.to(bike, {
                    x: endX,
                    duration: 0.5,
                    ease: "elastic.out(1.2, 0.5)",
                });

                // Bike rocks after stop like it's settling
                bikeTl.to(bikeImg, {
                    rotate: 3,
                    y: 0,
                    duration: 0.35,
                    ease: "elastic.out(1, 0.4)",
                }, "<");

                // ── Phase 5: PARKED IDLE WOBBLE — tiny sway like engine rumble
                bikeTl.to(bikeImg, {
                    rotate: -2,
                    duration: 0.4,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: 3,
                }, ">");

                bikeTl.to(bikeImg, {
                    rotate: 0,
                    skewX: 0,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out",
                }, ">");

                // Switch to idle smoke after bike stops
                bikeTl.call(() => {
                    smokeTweens.forEach(t => t.kill());
                    startIdlingSmoke();
                });

                // ── Continuous engine micro-vibration after parking (Aggressive Shaking)
                bikeTl.to(bikeImg, {
                    y: -2,
                    x: 0.5,
                    rotate: 0.5,
                    duration: 0.05,
                    ease: "none",
                    yoyo: true,
                    repeat: -1,
                }, ">");
            }

        }, containerRef);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <section
            ref={containerRef}
            className="min-h-screen flex items-center justify-center md:justify-start px-6 md:px-14 relative overflow-x-hidden"
            style={{ perspective: '800px' }}
        >

            {/* BG layers */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
                <div
                    ref={bgRef}
                    className="absolute inset-0 bg-no-repeat bg-center bg-cover md:bg-[length:contain] md:bg-[size:60%_auto]"
                    style={{
                        backgroundImage: 'url("/scrollimage3.png")',
                        willChange: 'transform, opacity',
                    }}
                />
                <div
                    ref={bgOverlayRef}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'var(--accent)',
                        mixBlendMode: 'multiply',
                        pointerEvents: 'none',
                    }}
                />
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
                            {["SomeBody", "who"].map((word, i) => (
                                <motion.span 
                                    key={i} 
                                    className="inline-block overflow-hidden mr-[0.6em] last:mr-0 pb-2"
                                    style={{ opacity: i === 0 ? w1Opacity : w2Opacity, y: i === 0 ? w1Y : w2Y }}
                                >
                                    <span
                                        ref={(el) => { wordRefs.current[i] = el; }}
                                        className="inline-block text-[var(--foreground)] tracking-tight uppercase"
                                        style={{
                                            fontFamily: '"Calistoga", serif',
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
                            {["can", "Build"].map((word, i) => (
                                <motion.span 
                                    key={i} 
                                    className="inline-block overflow-hidden mr-[0.6em] last:mr-0 pb-2"
                                    style={{ opacity: i === 0 ? w3Opacity : w4Opacity, y: i === 0 ? w3Y : w4Y }}
                                >
                                    <span
                                        ref={(el) => { wordRefs.current[i + 2] = el; }}
                                        className="inline-block text-[var(--accent)] tracking-tight uppercase"
                                        style={{
                                            fontFamily: '"Calistoga", serif',
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
                                        fontFamily: '"Calistoga", serif',
                                        fontSize: 'clamp(3.2rem, 18vw, 5.5rem)',
                                        willChange: 'transform, opacity',
                                        lineHeight: 1.2,
                                        paddingRight: '0.1em'
                                    }}
                                >
                                    SomeBody
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
                                        fontFamily: '"Calistoga", serif',
                                        fontSize: 'clamp(3.2rem, 18vw, 5.5rem)',
                                        willChange: 'transform, opacity',
                                        lineHeight: 1.2,
                                        paddingRight: '0.1em'
                                    }}
                                >
                                    who
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
                                        fontFamily: '"Calistoga", serif',
                                        fontSize: 'clamp(3.2rem, 18vw, 5.5rem)',
                                        willChange: 'transform, opacity',
                                        lineHeight: 1.2,
                                        paddingRight: '0.1em'
                                    }}
                                >
                                    can
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
                                        fontFamily: '"Calistoga", serif',
                                        fontSize: 'clamp(3.2rem, 18vw, 5.5rem)',
                                        willChange: 'transform, opacity',
                                        lineHeight: 1.2,
                                        paddingRight: '0.1em'
                                    }}
                                >
                                    Build
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
                style={{ zIndex: 15 }}
            >
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
                
                {/* Audio element for bike sound */}
                <audio ref={audioRef} src="/bikesound.mp3" preload="auto" loop />

                <img
                    ref={bikeImgRef}
                    src="/scrollimage.png"
                    alt="Bike riding"
                    className="w-40 md:w-56 h-auto object-contain relative transition-all duration-200 group-hover:brightness-110 group-active:scale-95"
                    style={{ zIndex: 10, transformOrigin: '50% 100%' }}
                />
            </div>
        </section>
    );
}