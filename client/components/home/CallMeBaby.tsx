'use client';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CallMeBaby = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const handRef = useRef<HTMLImageElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Text entrance
            gsap.from(textRef.current?.children || [], {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out"
            });

            // Phone Hand animation
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 60%",
                    toggleActions: "play none none none", // Triggers on enter
                }
            });

            tl.fromTo(handRef.current, 
                { x: '-110%', opacity: 0 },
                { x: '0%', opacity: 1, duration: 1, ease: "power3.out" }
            )
            .to(handRef.current, 
                { x: '-110%', opacity: 0, duration: 1, delay: 2, ease: "power3.in" }
            );

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section 
            ref={containerRef}
            className="relative z-20 w-full py-32 px-6 md:px-14 flex flex-col items-center text-center"
            style={{ 
                background: '#1084a2', // Crystal Blue
                color: '#ffffff' 
            }}
        >
            {/* ── PHONE HAND IMAGE ── */}
            <img 
                ref={handRef}
                src="/phonehand.png" 
                alt="Call me hand"
                className="absolute left-0 bottom-0 w-32 md:w-64 h-auto pointer-events-none z-20"
                style={{ transform: 'translateX(-110%)' }}
            />

            {/* ── TOP TORN EDGE ── */}

            <div className="absolute top-0 left-0 w-full h-12 md:h-16 -translate-y-[98%] pointer-events-none select-none overflow-hidden" style={{ zIndex: 11 }}>
                <svg 
                    viewBox="0 0 1440 60" 
                    className="w-full h-full block scale-x-[-1]" 
                    preserveAspectRatio="none"
                >
                    <path 
                        fill="#1084a2" 
                        d="M0,60 L0,30 L15,31 L30,29 L45,32 L60,30 L75,28 L90,31 L105,29 L120,30 L135,32 L150,28 L165,30 L180,31 L195,29 L210,32 L225,30 L240,28 L255,31 L270,29 L285,30 L300,32 L315,28 L330,30 L345,31 L360,29 L375,32 L390,30 L405,28 L420,31 L435,29 L450,30 L465,32 L480,28 L495,30 L510,31 L525,29 L540,32 L555,30 L570,28 L585,31 L600,29 L615,30 L630,32 L645,28 L660,30 L675,31 L690,29 L705,32 L720,30 L735,28 L750,31 L765,29 L780,30 L795,32 L810,28 L825,30 L840,31 L855,29 L870,32 L885,30 L900,28 L915,31 L930,29 L945,30 L960,32 L975,28 L990,30 L1005,31 L1020,29 L1035,32 L1050,30 L1065,28 L1080,31 L1095,29 L1110,30 L1125,32 L1140,28 L1155,30 L1170,31 L1185,29 L1200,32 L1215,30 L1230,28 L1245,31 L1260,29 L1275,30 L1290,32 L1305,28 L1320,30 L1335,31 L1350,29 L1365,32 L1380,30 L1395,28 L1410,31 L1425,29 L1440,30 L1440,60 Z" 
                    />
                </svg>
            </div>

            {/* ── CONTENT ── */}
            <div ref={textRef} className="max-w-4xl mx-auto space-y-6">
                <h2 
                    className="text-6xl md:text-8xl font-black uppercase tracking-tighter"
                    style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                >
                    CALL ME, BABY
                </h2>
                
                <p className="text-xl md:text-3xl font-bold leading-tight">
                    I'm looking for a challenging new position that will help me squeeze out the best of my creative juices!
                </p>

                <p className="text-lg md:text-xl font-medium opacity-90 max-w-2xl mx-auto leading-relaxed">
                    If you like to sound of a web designer, developer and graphic designer rolled into one whacky human, then I'm your man. Don't hesitate to contact me - I'm eager to hear from you!
                </p>

                <div className="pt-8">
                    <button 
                        className="px-10 py-4 bg-[#1a1a1a] text-white rounded-full text-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-xl active:scale-95"
                        style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                    >
                        GO TO MY CALENDAR
                    </button>
                </div>
            </div>

            {/* ── BOTTOM TORN EDGE ── */}
            <div className="absolute bottom-0 left-0 w-full h-12 md:h-16 translate-y-[98%] pointer-events-none select-none overflow-hidden" style={{ zIndex: 11 }}>
                <svg 
                    viewBox="0 0 1440 60" 
                    className="w-full h-full block scale-y-[-1]" 
                    preserveAspectRatio="none"
                >
                    <path 
                        fill="#1084a2" 
                        d="M0,60 L0,30 L15,31 L30,29 L45,32 L60,30 L75,28 L90,31 L105,29 L120,30 L135,32 L150,28 L165,30 L180,31 L195,29 L210,32 L225,30 L240,28 L255,31 L270,29 L285,30 L300,32 L315,28 L330,30 L345,31 L360,29 L375,32 L390,30 L405,28 L420,31 L435,29 L450,30 L465,32 L480,28 L495,30 L510,31 L525,29 L540,32 L555,30 L570,28 L585,31 L600,29 L615,30 L630,32 L645,28 L660,30 L675,31 L690,29 L705,32 L720,30 L735,28 L750,31 L765,29 L780,30 L795,32 L810,28 L825,30 L840,31 L855,29 L870,32 L885,30 L900,28 L915,31 L930,29 L945,30 L960,32 L975,28 L990,30 L1005,31 L1020,29 L1035,32 L1050,30 L1065,28 L1080,31 L1095,29 L1110,30 L1125,32 L1140,28 L1155,30 L1170,31 L1185,29 L1200,32 L1215,30 L1230,28 L1245,31 L1260,29 L1275,30 L1290,32 L1305,28 L1320,30 L1335,31 L1350,29 L1365,32 L1380,30 L1395,28 L1410,31 L1425,29 L1440,30 L1440,60 Z" 
                    />
                </svg>
            </div>
        </section>
    );
};

export default CallMeBaby;
