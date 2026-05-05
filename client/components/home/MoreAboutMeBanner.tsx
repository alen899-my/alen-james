'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function MoreAboutMeBanner() {
    return (
        <section className="relative w-full py-28 px-6 md:px-14 flex flex-col items-center text-center overflow-hidden" style={{ background: 'var(--background)' }}>
             {/* ── BACKGROUND DECORATIONS ── */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                 <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* ── TOP BORDER GRADIENT ── */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-30" />
            
            <div className="relative z-10 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <span 
                        className="inline-block mb-4 text-sm md:text-base font-medium tracking-[0.3em] uppercase opacity-60"
                        style={{ color: 'var(--foreground)' }}
                    >
                        Keep Exploring
                    </span>
                    
                    <h2 
                        className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight"
                        style={{ 
                            fontFamily: '"Patrick Hand SC", cursive', 
                            color: 'var(--foreground)',
                            textTransform: 'uppercase'
                        }}
                    >
                        Do you think <span style={{ color: 'var(--accent)' }}>that's it?</span>
                    </h2>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-lg md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed italic"
                        style={{ 
                            color: 'var(--foreground)',
                            opacity: 0.75,
                            fontFamily: '"Lora", Georgia, serif'
                        }}
                    >
                        No, there is so much more to know about my journey, 
                        my process, and the stories behind the pixels.
                    </motion.p>

                    <Link href="/about">
                        <motion.div
                            whileHover="hover"
                            className="inline-flex items-center group relative"
                        >
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="relative z-10 px-10 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-sm transition-all duration-300 shadow-lg group-hover:shadow-2xl overflow-hidden"
                                style={{ 
                                    background: 'var(--foreground)', 
                                    color: 'var(--background)',
                                    fontFamily: '"Patrick Hand SC", cursive',
                                }}
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    Click here to learn more
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                                
                                {/* Hover background effect */}
                                <motion.div 
                                    variants={{
                                        hover: { x: 0 }
                                    }}
                                    initial={{ x: '-101%' }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                    className="absolute inset-0 bg-[var(--accent)]"
                                />
                            </motion.button>
                            
                            {/* Outer glow/ring */}
                            <div className="absolute inset-0 -m-1 rounded-full border border-[var(--accent)] opacity-0 group-hover:opacity-40 scale-105 group-hover:scale-110 transition-all duration-500" />
                        </motion.div>
                    </Link>
                </motion.div>
            </div>

            {/* ── BOTTOM BORDER GRADIENT ── */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-30" />

            {/* ── DECORATIVE CIRCLES ── */}
            <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--accent)] rounded-full blur-[120px] opacity-10 pointer-events-none" />
            <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--accent)] rounded-full blur-[120px] opacity-10 pointer-events-none" />
        </section>
    );
}
