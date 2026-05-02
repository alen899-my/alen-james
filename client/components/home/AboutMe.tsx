'use client';

import React from 'react';

export default function AboutMe() {
    return (
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-8 text-center">
            {/* Centered Heading */}
            <h2 
                className="text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter"
                style={{ fontFamily: '"Calistoga", serif', lineHeight: 0.9, color: '#1a1a1a' }}
            >
                About Me
            </h2>

            {/* Centered Intro Paragraph */}
            <p className="text-2xl md:text-3xl lg:text-4xl font-extrabold max-w-3xl leading-tight text-[#1a1a1a]">
                Hi, I'm Alen – a friendly chap, designer, AI Specialist, Developer and analyst who loves solving real problems.
            </p>

            {/* Centered Body Text */}
            <div className="space-y-6 max-w-3xl opacity-80 leading-relaxed text-lg md:text-xl font-medium mt-4 text-[#333]">
                <p>
                    My mission is to spice up design, stray away from the same hardcoded AI sites and trends, and inject personality into the work I create for brands and individuals.
                </p>
                <p>
                    Together we can exit the design 'comfort zone' and blast off into a world of daring design. I'm a keen communicator, so expect someone who can lead teams, convey big ideas to co-workers and clients, and guide projects towards success whatever the weather.
                </p>
                <p>
                    I was born in India and studied BTech Computer Science at KTU University. I'm always ready to embrace new challenges, and I can easily travel anywhere for convenience.
                </p>
            </div>

            {/* Simple minimalist divider */}
            <div className="w-16 h-1 bg-[var(--accent)] mt-8 rounded-full" />
        </div>
    );
}
