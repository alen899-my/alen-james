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

export default function WorkCard({ work, index }: WorkCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "circOut", delay: index ? index * 0.05 : 0 }}
            className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden transition-all duration-500"
        >
            {/* Image */}
            {work.main_image ? (
                <Image
                    src={work.main_image}
                    alt={work.title}
                    fill
                    priority={index !== undefined && index < 4}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain transition-transform duration-700"
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
                <div className="text-left flex-1 min-w-0 mr-4">
                    <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight truncate" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                        {work.title}
                    </h3>
                    
                    {/* Skills / Tech Icons */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {work.skills?.map((skill) => (
                            <div 
                                key={skill.id} 
                                className="flex items-center gap-1.5 px-2 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 group/skill hover:bg-white/20 transition-colors"
                                title={skill.name}
                            >
                                {skill.image && (
                                    <img src={skill.image} alt={skill.name} className="w-3.5 h-3.5 object-contain" />
                                )}
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">{skill.name}</span>
                            </div>
                        ))}
                        {work.tech_stacks?.map((tech, idx) => (
                            <div 
                                key={idx} 
                                className="flex items-center px-2 py-1 bg-white/5 backdrop-blur-md rounded-lg border border-white/5"
                            >
                                <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{tech}</span>
                            </div>
                        ))}
                    </div>

                    {work.subtitle && (
                        <p className="text-white/60 text-[10px] font-bold mt-2 uppercase tracking-[0.2em]">{work.subtitle}</p>
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
