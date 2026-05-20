'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Award, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import { Education } from '@/lib/admin/models/education.model';
import gsap from 'gsap';

interface EducationClientProps {
    education: Education[];
}

export default function EducationClient({ education }: EducationClientProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);

    // Sort newest first
    const sortedEducation = [...education].sort((a, b) => {
        const yearA = parseInt(a.year_from || '0') || 0;
        const yearB = parseInt(b.year_from || '0') || 0;
        return yearB - yearA;
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
                    Education
                </h1>
                <p className="text-xl md:text-2xl font-medium text-[var(--muted-foreground)] max-w-2xl leading-tight">
                    My academic journey and educational background — every school, course, and milestone that shaped me.
                </p>
            </div>

            {/* Education Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <AnimatePresence mode="popLayout">
                    {sortedEducation.map((edu, index) => {
                        const date = [edu.year_from, edu.year_to || 'Present'].filter(Boolean).join(' – ');
                        const mainImage = edu.school_photo;

                        return (
                            <motion.div
                                key={edu.id}
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
                                        alt={edu.name}
                                        fill
                                        priority={index < 2}
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/30 via-[var(--accent)]/10 to-[var(--muted)] flex items-center justify-center">
                                        <GraduationCap className="w-16 h-16 text-white/20" />
                                    </div>
                                )}

                                {/* Grade Badge */}
                                {edu.grade_mark && (
                                    <div className="absolute top-5 right-5 z-20">
                                        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-white text-[var(--accent)] shadow-xl border border-[var(--accent)]/10">
                                            <Award size={14} className="text-[var(--accent)]" />
                                            <span className="text-[10px] font-black leading-none mt-0.5">{edu.grade_mark}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Dark gradient overlay — same as WorkCard */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-100 md:opacity-80 md:group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-transform duration-300 z-10">
                                    <div className="text-left flex-1 min-w-0 mr-4">
                                        <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight truncate leading-none mb-1" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                                            {edu.name}
                                        </h3>
                                        
                                        {edu.studied && (
                                            <p className="text-white/80 text-base md:text-lg font-bold mb-2 truncate" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                                                {edu.studied}
                                            </p>
                                        )}
                                        
                                        <div className="flex flex-wrap gap-2 items-center">
                                            {date && (
                                                <div className="flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded-md border border-white/5 text-white/80">
                                                    <Calendar size={10} />
                                                    <span className="text-[9px] font-bold uppercase tracking-wider">{date}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {sortedEducation.length === 0 && (
                <div className="py-32 text-center">
                    <p className="text-2xl md:text-4xl font-black uppercase tracking-tight text-[var(--muted-foreground)]/30" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                        No education entries recorded yet...
                    </p>
                </div>
            )}
        </div>
    );
}
