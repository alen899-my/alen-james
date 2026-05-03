'use client';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutMe() {
    const containerRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const introRef = useRef<HTMLParagraphElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const dividerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Setup the rolling entry animation
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%", 
                    toggleActions: "play none none none",
                }
            });

            tl.from(headingRef.current, {
                y: 120,
                rotateX: -60,
                opacity: 0,
                duration: 1.5,
                ease: "expo.out",
                transformOrigin: "top center",
            })
            .from(introRef.current, {
                y: 60,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out"
            }, "-=1.0")
            .from(bodyRef.current?.children || [], {
                y: 40,
                rotateX: -15,
                opacity: 0,
                stagger: 0.15,
                duration: 1,
                ease: "power2.out",
                transformOrigin: "top center",
            }, "-=0.8")
            .from(dividerRef.current, {
                scaleX: 0,
                opacity: 0,
                duration: 1,
                ease: "expo.inOut"
            }, "-=0.6");
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="max-w-4xl mx-auto flex flex-col items-center gap-8 text-center perspective-1000 transform-style-3d">
            {/* Centered Heading */}
            <h2 
                ref={headingRef}
                className="text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter backface-hidden"
                style={{ fontFamily: '"Patrick Hand SC", cursive', lineHeight: 0.9, color: '#1a1a1a' }}
            >
                About Me
            </h2>


            {/* Centered Intro Paragraph */}
            <p ref={introRef} className="text-2xl md:text-3xl lg:text-4xl font-extrabold max-w-3xl leading-tight text-[#1a1a1a]" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                Hi, I'm Alen – a friendly chap, designer, AI Specialist, Developer and analyst who loves solving real problems.
            </p>

            {/* Centered Body Text */}
            <div ref={bodyRef} className="space-y-6 max-w-3xl opacity-80 leading-relaxed text-lg md:text-xl font-medium mt-4 text-[#333]" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                <p>
                    My mission is to spice up design, stray away from the same hardcoded AI sites and trends, and inject personality into the work I create for brands and individuals.
                </p>
                <p>
                    Together we can exit the design 'comfort zone' and blast off into a world of daring design. I'm a keen communicator, so expect someone who can lead teams, convey big ideas to co-workers and clients, and guide Works towards success whatever the weather.
                </p>
                <p>
                    I was born in India and studied BTech Computer Science at KTU University. I'm always ready to embrace new challenges, and I can easily travel anywhere for convenience.
                </p>
            </div>

            {/* Simple minimalist divider */}
            <div ref={dividerRef} className="w-16 h-1 bg-[var(--accent)] mt-8 rounded-full" />
        </div>
    );
}

