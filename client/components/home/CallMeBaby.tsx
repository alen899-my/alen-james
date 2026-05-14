'use client';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

import { Phone, MessageCircle, Mail } from 'lucide-react';

const CallMeBaby = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const handRef = useRef<HTMLImageElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Text entrance animation - NO SCROLL TRIGGER
            gsap.from(textRef.current?.children || [], {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out"
            });

            // Phone Hand animation - entrance only
            const tl = gsap.timeline();

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
                        d="M0,60 L0,30 L15,31 L30,29 L45,32 L60,30 L75,28 L90,31 L105,29 L120,30 L135,32 L150,28 L165,30 L180,31 L195,29 L210,32 L225,30 L240,28 L255,31 L270,29 L285,30 L300,32 L315,30 L330,28 L345,31 L360,29 L375,30 L390,32 L405,28 L420,30 L435,31 L450,29 L465,32 L480,30 L495,28 L510,31 L525,29 L540,30 L555,32 L570,28 L585,30 L600,31 L615,29 L630,32 L645,30 L660,28 L675,31 L690,29 L705,30 L720,32 L735,30 L750,28 L765,31 L780,29 L795,30 L810,32 L825,28 L840,30 L855,31 L870,29 L885,32 L900,30 L915,28 L930,31 L945,29 L960,30 L975,32 L990,28 L1005,30 L1020,31 L1035,29 L1050,32 L1065,30 L1080,28 L1095,31 L1110,29 L1125,30 L1140,32 L1155,28 L1170,30 L1185,31 L1200,29 L1215,32 L1230,30 L1245,28 L1260,31 L1275,29 L1290,30 L1305,32 L1320,30 L1335,28 L1350,31 L1365,29 L1380,30 L1395,32 L1410,30 L1425,28 L1440,31 L1440,60 Z"
                    />
                </svg>
            </div>

            {/* ── CONTENT ── */}
            <div ref={textRef} className="max-w-4xl mx-auto space-y-6">
                <h2 
                    className="text-6xl md:text-8xl font-black uppercase tracking-tighter"
                    style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                >
                    CALL ME NOW
                </h2>
                
                <p className="text-xl md:text-3xl font-bold leading-tight">
                    I'm looking for a challenging new position that will help me squeeze out the best of my creative juices!
                </p>

                <p className="text-lg md:text-xl font-medium opacity-90 max-w-2xl mx-auto leading-relaxed">
                    If you like the sound of a web designer, developer and graphic designer rolled into one whacky human, then I'm your man. Don't hesitate to contact me - I'm eager to hear from you.
                </p>

                <div className="pt-8 flex flex-wrap justify-center gap-4">
                    <a 
                        href="tel:+918921837945"
                        className="flex items-center gap-2 p-5 md:px-8 md:py-4 bg-[#1a1a1a] text-white rounded-full text-lg font-bold uppercase tracking-widest hover:scale-105 transition-transform duration-200"
                        style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                    >
                        <Phone size={20} /> <span className="hidden md:inline">CALL</span>
                    </a>
                    
                    <a 
                        href="https://wa.me/918921837945"
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 p-5 md:px-8 md:py-4 bg-[#25D366] text-white rounded-full text-lg font-bold uppercase tracking-widest hover:scale-105 transition-transform duration-200"
                        style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                    >
                        <MessageCircle size={20} /> <span className="hidden md:inline">WHATSAPP</span>
                    </a>

                    <a 
                        href="mailto:alenjames899@gmail.com"
                        className="flex items-center gap-2 p-5 md:px-8 md:py-4 bg-[#f0ede6] text-[#1a1a1a] rounded-full text-lg font-bold uppercase tracking-widest hover:scale-105 transition-transform duration-200"
                        style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                    >
                        <Mail size={20} /> <span className="hidden md:inline">EMAIL</span>
                    </a>
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
                        d="M0,60 L0,30 L15,31 L30,29 L45,32 L60,30 L75,28 L90,31 L105,29 L120,30 L135,32 L150,28 L165,30 L180,31 L195,29 L210,32 L225,30 L240,28 L255,31 L270,29 L285,30 L300,32 L315,30 L330,28 L345,31 L360,29 L375,30 L390,32 L405,28 L420,30 L435,31 L450,29 L465,32 L480,30 L495,28 L510,31 L525,29 L540,30 L555,32 L570,28 L585,30 L600,31 L615,29 L630,32 L645,30 L660,28 L675,31 L690,29 L705,30 L720,32 L735,30 L750,28 L765,31 L780,29 L795,30 L810,32 L825,28 L840,30 L855,31 L870,29 L885,32 L900,30 L915,28 L930,31 L945,29 L960,30 L975,32 L990,28 L1005,30 L1020,31 L1035,29 L1050,32 L1065,30 L1080,28 L1095,31 L1110,29 L1125,30 L1140,32 L1155,28 L1170,30 L1185,31 L1200,29 L1215,32 L1230,30 L1245,28 L1260,31 L1275,29 L1290,30 L1305,32 L1320,30 L1335,28 L1350,31 L1365,29 L1380,30 L1395,32 L1410,30 L1425,28 L1440,31 L1440,60 Z"
                    />
                </svg>
            </div>
        </section>
    );
};

export default CallMeBaby;
