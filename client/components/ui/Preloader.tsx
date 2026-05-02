'use client';

import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const bikeWrapperRef = useRef<HTMLDivElement>(null);
    const bikeRef = useRef<HTMLImageElement>(null);
    const smokeRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        // Prevent body scroll while loading
        document.body.style.overflow = 'hidden';

        // 1. Subtle, realistic idle vibration (not harsh jumping)
        if (bikeRef.current) {
            gsap.to(bikeRef.current, {
                y: -1.5,
                rotate: 0.5,
                duration: 0.05,
                repeat: -1,
                yoyo: true,
                ease: "none"
            });
        }

        // 2. Continuous smoke animation
        if (smokeRef.current) {
            const puffs = smokeRef.current.querySelectorAll('.smoke-puff');
            puffs.forEach((puff, i) => {
                gsap.fromTo(puff,
                    { opacity: 0.8, scale: 0.5, x: 0, y: 0 },
                    {
                        opacity: 0,
                        scale: 1.5 + Math.random(),
                        x: -20 - Math.random() * 20,
                        y: -10 - Math.random() * 20,
                        duration: 1.2 + Math.random(),
                        repeat: -1,
                        delay: i * 0.3,
                        ease: "power1.out"
                    }
                );
            });
        }

        const exitAnimation = () => {
            // Wait briefly to show the idle animation
            setTimeout(() => {
                const tl = gsap.timeline({
                    onComplete: () => {
                        document.body.style.overflow = '';
                        setIsLoading(false);
                    }
                });

                // Bike does a slight "wheelie" lean back to launch
                tl.to(bikeRef.current, {
                    rotate: -8,
                    duration: 0.2,
                    ease: "power2.out"
                });

                // Bike drives off screen to the right VERY fast
                tl.to(bikeWrapperRef.current, {
                    x: window.innerWidth + 300,
                    duration: 0.8,
                    ease: "power2.in"
                }, "<");

                // Background fades out slightly delayed
                tl.to(containerRef.current, {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.inOut"
                }, "-=0.3");

            }, 1000);
        };

        if (document.readyState === 'complete') {
            exitAnimation();
        } else {
            window.addEventListener('load', exitAnimation);
            return () => window.removeEventListener('load', exitAnimation);
        }
    }, []);

    if (!isLoading) return null;

    return (
        <div 
            ref={containerRef}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--background)]"
        >
            <div ref={bikeWrapperRef} className="relative flex flex-col items-center">
                
                {/* Smoke SVG behind bike */}
                <svg
                    ref={smokeRef}
                    width="120"
                    height="100"
                    className="absolute -left-12 bottom-4 pointer-events-none"
                    viewBox="0 0 120 100"
                    style={{ zIndex: 0 }}
                >
                    <defs>
                        <filter id="preloaderSmokeBlur">
                            <feGaussianBlur stdDeviation="5" />
                        </filter>
                    </defs>
                    <circle className="smoke-puff" cx="100" cy="80" r="10" fill="#94a3b8" filter="url(#preloaderSmokeBlur)" />
                    <circle className="smoke-puff" cx="100" cy="80" r="14" fill="#cbd5e1" filter="url(#preloaderSmokeBlur)" />
                    <circle className="smoke-puff" cx="100" cy="80" r="12" fill="#64748b" filter="url(#preloaderSmokeBlur)" />
                </svg>

                {/* Bike Image */}
                <img 
                    ref={bikeRef}
                    src="/scrollimage.png" 
                    alt="Loading..." 
                    className="w-48 md:w-64 h-auto object-contain z-10 drop-shadow-xl"
                    style={{ transformOrigin: '70% 100%' }} // Transform around rear wheel
                />
                
                {/* Ground shadow for depth */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 md:w-56 h-3 bg-black/15 rounded-[100%] blur-md z-0" />
                
                {/* Loading Text */}
                <div className="absolute -bottom-16 w-full text-center overflow-hidden">
                    <p 
                        className="text-[var(--accent)] font-bold tracking-[0.2em] uppercase text-xl md:text-2xl animate-pulse"
                        style={{ fontFamily: '"Calistoga", serif' }}
                    >
                        Loading
                    </p>
                </div>
            </div>
        </div>
    );
}
