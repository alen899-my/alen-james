'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { WHY_WORK_WITH_ME } from '@/constants/why-work-with-me';

export default function WhyWorkWithMe() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section
            ref={containerRef}
            className="relative z-10 w-full py-24 md:py-32 px-6 md:px-14 overflow-hidden bg-[var(--background)]"
        >
            <div className="max-w-7xl mx-auto relative">
                <h2
                    className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-24 md:mb-32"
                    style={{ fontFamily: '"Patrick Hand SC", cursive', color: 'var(--foreground)' }}
                >
                    Why Work With Me?
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
                    {/* ── Content Column (Full Width on Mobile) ── */}
                    <div className="lg:col-span-12 space-y-24 md:space-y-32">
                        {WHY_WORK_WITH_ME.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-100px' }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className="relative group"
                            >
                                <div className="flex items-start gap-4 md:gap-8">
                                    <span
                                        className="text-xl md:text-3xl font-bold mt-2"
                                        style={{ fontFamily: '"Patrick Hand SC", cursive', color: 'var(--foreground)' }}
                                    >
                                        {item.id}
                                    </span>
                                    <div>
                                        <h3
                                            className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-6"
                                            style={{ fontFamily: '"Patrick Hand SC", cursive', color: '#1084a2' }}
                                        >
                                            {item.title}
                                        </h3>
                                        <p className="text-lg md:text-xl font-medium leading-tight max-w-2xl text-[var(--muted-foreground)]">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
