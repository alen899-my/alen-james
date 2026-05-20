'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Work } from '@/lib/admin/models/works.model';

interface WorkCardProps {
    work: Work;
    index?: number;
}

export default function WorkCard({ work, index = 0 }: WorkCardProps) {
    return (
        <motion.div
            layout="position"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: Math.min(index * 0.05, 0.2) }}
            className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden"
        >
            {/* Image */}
            {work.main_image ? (
                <Image
                    src={work.main_image}
                    alt={work.title}
                    fill
                    priority={index < 2}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--muted)]/50 to-[var(--card)]">
                    <span className="text-[var(--muted-foreground)]/50 font-bold uppercase tracking-widest text-xs">No Preview</span>
                </div>
            )}

            {/* Gradient overlay — CSS only, no JS */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 md:opacity-80 md:group-hover:opacity-100 transition-opacity duration-300" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-transform duration-300">
                <div className="text-left flex-1 min-w-0 mr-4">
                    <h3
                        className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight truncate"
                        style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                    >
                        {work.title}
                    </h3>

                    {/* Skills — removed backdrop-blur from every chip (very expensive on mobile) */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {work.skills?.map((skill) => (
                            <div
                                key={skill.id}
                                className="flex items-center gap-1 px-2 py-0.5 bg-white/15 rounded-md border border-white/10"
                                title={skill.name}
                            >
                                {skill.image && (
                                    <img src={skill.image} alt="" aria-hidden="true" className="w-3 h-3 object-contain" />
                                )}
                                <span className="text-[9px] font-bold text-white uppercase tracking-wider">{skill.name}</span>
                            </div>
                        ))}
                        {work.tech_stacks?.map((tech, idx) => (
                            <div
                                key={idx}
                                className="flex items-center px-2 py-0.5 bg-white/8 rounded-md border border-white/5"
                            >
                                <span className="text-[9px] font-bold text-white/70 uppercase tracking-wider">{tech}</span>
                            </div>
                        ))}
                    </div>

                    {work.subtitle && (
                        <p className="text-white/60 text-[10px] font-bold mt-1.5 uppercase tracking-[0.2em]">{work.subtitle}</p>
                    )}
                </div>

                <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-white flex items-center justify-center text-black rotate-0 md:-rotate-45 md:group-hover:rotate-0 transition-transform duration-300 shadow-lg">
                    <ChevronRight size={20} />
                </div>
            </div>

            {/* Full-card link */}
            <Link
                href={`/work/${work.id}`}
                className="absolute inset-0 z-10"
                aria-label={`View ${work.title}`}
            />
        </motion.div>
    );
}
