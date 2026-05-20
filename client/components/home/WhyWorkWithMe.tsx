'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { WHY_WORK_WITH_ME } from '@/constants/why-work-with-me';

export default function WhyWorkWithMe() {
    return (
        <section className="relative z-10 w-full py-24 md:py-32 px-6 md:px-14 overflow-hidden bg-[var(--background)]">
            <div className="max-w-7xl mx-auto relative">
                <h2
                    className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-24 md:mb-32"
                    style={{ fontFamily: '"Patrick Hand SC", cursive', color: 'var(--foreground)' }}
                >
                    Why Work With Me?
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
                    <div className="lg:col-span-12 space-y-24 md:space-y-32">
                        {WHY_WORK_WITH_ME.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.3) }}
                                className="relative"
                            >
                                <div className="flex items-start gap-4 md:gap-8">
                                    <span
                                        className="text-xl md:text-3xl font-bold mt-2 shrink-0"
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
