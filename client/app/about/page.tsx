'use client';

import React, { useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import { gsap } from 'gsap';

export default function AboutPage() {
    const headerRef = useRef<HTMLHeadingElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.2 } });

        tl.fromTo(headerRef.current, 
            { y: 100, opacity: 0 }, 
            { y: 0, opacity: 1, delay: 0.5 }
        )
        .fromTo(contentRef.current?.children || [], 
            { y: 50, opacity: 0 }, 
            { y: 0, opacity: 1, stagger: 0.2 },
            '-=0.8'
        )
        .fromTo(cardsRef.current?.children || [], 
            { scale: 0.9, opacity: 0 }, 
            { scale: 1, opacity: 1, stagger: 0.15 },
            '-=1'
        );
    }, []);

    return (
        <main className="min-h-screen bg-[var(--background)] overflow-x-hidden">
            <Navbar />
            
            <section className="pt-32 pb-20 px-6 md:px-14 max-w-7xl mx-auto">
                <div className="flex flex-col gap-12">
                    <h1 
                        ref={headerRef}
                        className="text-[var(--foreground)] text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tighter"
                        style={{ fontFamily: '"Calistoga", serif', lineHeight: 0.9 }}
                    >
                        About <br />
                        <span className="text-[var(--accent)]">Me</span>
                    </h1>

                    <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                        <div className="space-y-8">
                            <p className="text-xl md:text-2xl text-[var(--foreground)] opacity-80 leading-relaxed font-medium">
                                I am Alen James, a passionate developer dedicated to creating digital experiences that bridge the gap between human intuition and technical precision.
                            </p>
                            <p className="text-lg md:text-xl text-[var(--muted-foreground)] leading-relaxed">
                                With a focus on high-fidelity interactions and premium design, I build web applications that don't just work—they feel alive. My approach combines the raw power of modern frameworks with the nuanced touch of a designer.
                            </p>
                        </div>

                        <div className="relative aspect-[4/5] bg-[var(--muted)] rounded-2xl overflow-hidden shadow-2xl group">
                            {/* Placeholder for About Image - will be replaced or animated */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/20 to-transparent z-10" />
                            <div className="absolute inset-0 flex items-center justify-center text-[var(--accent)] opacity-20 group-hover:opacity-40 transition-opacity">
                                <span style={{ fontFamily: '"Calistoga", serif', fontSize: '10vw' }}>AJ</span>
                            </div>
                        </div>
                    </div>

                    <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        {[
                            { label: 'Philosophy', text: 'Design with a human touch, code with surgical precision.' },
                            { label: 'Experience', text: 'Years of crafting premium digital products for diverse clients.' },
                            { label: 'Vision', text: 'To push the boundaries of what is possible on the web.' }
                        ].map((item, i) => (
                            <div key={i} className="p-8 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors">
                                <h3 className="text-[var(--accent)] font-bold uppercase tracking-widest text-sm mb-4" style={{ fontFamily: '"Space Mono", monospace' }}>
                                    {item.label}
                                </h3>
                                <p className="text-[var(--foreground)] opacity-80">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
