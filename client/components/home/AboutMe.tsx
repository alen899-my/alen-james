'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutMe() {
    const containerRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const introRef = useRef<HTMLParagraphElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const dividerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 85%',
                    once: true,
                }
            });

            // immediateRender: false — prevents GSAP from setting opacity:0 on mount
            // Content stays visible even if the ScrollTrigger doesn't fire
            tl.from(headingRef.current, {
                y: 80,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                immediateRender: false,
            })
            .from(introRef.current, {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                immediateRender: false,
            }, '-=0.6')
            .from(bodyRef.current?.children || [], {
                y: 30,
                opacity: 0,
                stagger: 0.12,
                duration: 0.7,
                ease: 'power2.out',
                immediateRender: false,
            }, '-=0.5')
            .from(dividerRef.current, {
                scaleX: 0,
                opacity: 0,
                duration: 0.6,
                ease: 'expo.inOut',
                immediateRender: false,
            }, '-=0.3');
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="max-w-4xl mx-auto flex flex-col items-center gap-8 text-center">
            <h2
                ref={headingRef}
                className="text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter"
                style={{ fontFamily: '"Patrick Hand SC", cursive', lineHeight: 0.9, color: 'var(--foreground)' }}
            >
                About Me
            </h2>

            <p
                ref={introRef}
                className="text-2xl md:text-3xl lg:text-4xl font-extrabold max-w-3xl leading-tight text-[var(--foreground)]"
                style={{ fontFamily: '"Patrick Hand SC", cursive' }}
            >
                Hi, I'm Alen – a friendly chap, designer, AI Specialist, Developer and analyst who loves solving real problems.
            </p>

            <div
                ref={bodyRef}
                className="space-y-6 max-w-3xl opacity-80 leading-relaxed text-lg md:text-xl font-medium mt-4 text-[var(--muted-foreground)]"
                style={{ fontFamily: '"Patrick Hand SC", cursive' }}
            >
                <p>
                    My mission is to spice up design, stray away from the same hardcoded AI sites and trends, and inject personality into the work I create for brands and individuals.
                </p>
                <p>
                    Together we can exit the design 'comfort zone' and blast off into a world of daring design. I'm a keen communicator, so expect someone who can lead teams, convey big ideas to clients, and advocate for the vision.
                </p>
                <p>
                    I was born in India and studied BTech Computer Science at KTU University. I'm always ready to embrace new challenges, and I can easily travel anywhere for convenience.
                </p>
            </div>

            <div ref={dividerRef} className="w-16 h-1 bg-[var(--accent)] mt-8 rounded-full" />
        </div>
    );
}
