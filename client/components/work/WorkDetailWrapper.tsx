'use client';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RollingEntranceProps {
    children: React.ReactNode;
}

export function RollingEntrance({ children }: RollingEntranceProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const elements = containerRef.current?.children;
            if (!elements) return;

            // Animate each child as it enters the viewport
            gsap.from(elements, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%", // Trigger when the top of the container hits 85% of viewport
                    toggleActions: "play none none none",
                },
                y: 100,
                rotateX: -60,
                opacity: 0,
                duration: 1.5,
                stagger: 0.15,
                ease: "expo.out",
                transformOrigin: "top center",
                clearProps: "all"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="perspective-1000 transform-style-3d">
            {children}
        </div>
    );
}

export function FadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        gsap.from(ref.current, {
            scrollTrigger: {
                trigger: ref.current,
                start: "top 90%",
                toggleActions: "play none none none",
            },
            y: 40,
            opacity: 0,
            duration: 1.2,
            delay,
            ease: "power3.out"
        });
    }, [delay]);

    return <div ref={ref}>{children}</div>;
}
