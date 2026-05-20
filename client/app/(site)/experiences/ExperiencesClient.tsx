'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Experience } from '@/lib/admin/models/experiences.model';
import gsap from 'gsap';

interface ExperiencesClientProps {
    experiences: Experience[];
}

export default function ExperiencesClient({ experiences }: ExperiencesClientProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);

    // Sort newest first
    const sortedExperiences = [...experiences].sort((a, b) => {
        const dateA = a.from_date ? new Date(a.from_date).getTime() : 0;
        const dateB = b.from_date ? new Date(b.from_date).getTime() : 0;
        return dateB - dateA;
    });

    useEffect(() => {
        if (!headingRef.current) return;

        const ctx = gsap.context(() => {
            gsap.from(headingRef.current, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="w-full max-w-7xl mx-auto px-6 md:px-14 py-24">
            <div className="text-left mb-16">
                <h1 
                    ref={headingRef}
                    className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-6"
                    style={{ fontFamily: '"Patrick Hand SC", cursive', color: 'var(--foreground)' }}
                >
                    Experiences
                </h1>
                <p className="text-xl md:text-2xl font-medium text-[var(--muted-foreground)] max-w-2xl leading-tight">
                    A journey through my professional career — every role, every milestone, and the lessons learned along the way.
                </p>
            </div>

            {/* Experiences Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <AnimatePresence mode="popLayout">
                    {sortedExperiences.map((exp, index) => {
                        const date = [exp.from_date, exp.to_date || 'Present'].filter(Boolean).join(' – ');
                        const mainImage = exp.images?.[0];

                        return (
                            <motion.div
                                key={exp.id}
                                layout="position"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, ease: "easeOut", delay: Math.min(index * 0.05, 0.2) }}
                                className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-xl transition-all duration-500"
                            >
                                {/* Image / Placeholder */}
                                {mainImage ? (
                                    <Image
                                        src={mainImage}
                                        alt={exp.job_title}
                                        fill
                                        priority={index < 2}
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/30 via-[var(--accent)]/10 to-[var(--muted)]" />
                                )}

                                {/* Dark gradient overlay — same as WorkCard */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-100 md:opacity-80 md:group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-transform duration-300 z-10">
                                    <div className="text-left flex-1 min-w-0 mr-4">
                                        <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight truncate leading-none mb-2" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                                            {exp.job_title}
                                        </h3>
                                        
                                        <div className="flex flex-wrap gap-2 items-center">
                                            {exp.location && (
                                                <div className="flex items-center gap-1 px-2 py-0.5 bg-white/15 rounded-md border border-white/10 text-white">
                                                    <MapPin size={10} />
                                                    <span className="text-[9px] font-bold uppercase tracking-wider">{exp.location}</span>
                                                </div>
                                            )}
                                            {date && (
                                                <div className="flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded-md border border-white/5 text-white/80">
                                                    <Calendar size={10} />
                                                    <span className="text-[9px] font-bold uppercase tracking-wider">{date}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Arrow button */}
                                    <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-white flex items-center justify-center text-black rotate-0 md:-rotate-45 md:group-hover:rotate-0 transition-transform duration-300 shadow-lg">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>

                                {/* Full card hover link */}
                                <Link href={`/jobs/${exp.id}`} className="absolute inset-0 z-10" aria-label={`View ${exp.job_title}`} />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {sortedExperiences.length === 0 && (
                <div className="py-32 text-center">
                    <p className="text-2xl md:text-4xl font-black uppercase tracking-tight text-[var(--muted-foreground)]/30" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                        No experiences recorded yet...
                    </p>
                </div>
            )}
        </div>
    );
}
