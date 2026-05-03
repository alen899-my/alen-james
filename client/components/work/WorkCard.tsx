'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Work } from '@/lib/admin/models/works.model';

interface WorkCardProps {
    work: Work;
    index?: number;
}

export default function WorkCard({ work, index }: WorkCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "circOut", delay: index ? index * 0.05 : 0 }}
            className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-xl transition-all duration-500"
        >
            {/* Image */}
            {work.main_image ? (
                <img
                    src={work.main_image}
                    alt={work.title}
                    className="w-full h-full object-contain transition-transform duration-700 bg-white"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--muted)]/50 to-[var(--card)]">
                    <span className="text-[var(--muted-foreground)]/50 font-bold uppercase tracking-widest text-xs">No Preview</span>
                </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 md:opacity-80 md:group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-transform duration-500">
                <div className="text-left">
                    <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                        {work.title}
                    </h3>
                    {work.subtitle && (
                        <p className="text-white/70 text-sm font-medium mt-1 uppercase tracking-wider">{work.subtitle}</p>
                    )}
                </div>
                <div className="w-12 h-12 shrink-0 rounded-full bg-white flex items-center justify-center text-black rotate-0 md:-rotate-45 md:group-hover:rotate-0 transition-transform duration-500 shadow-lg">
                    <ChevronRight size={24} />
                </div>
            </div>

            {/* Hover link */}
            <Link
                href={`/work/${work.id}`}
                className="absolute inset-0 z-10"
                aria-label={`View ${work.title}`}
            />

        </motion.div>
    );
}
