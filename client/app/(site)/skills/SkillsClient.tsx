'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Skill } from '@/lib/admin/models/skills.model';

interface SkillsClientProps {
    skills: Skill[];
}

export default function SkillsClient({ skills }: SkillsClientProps) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const item: any = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <section className="w-full max-w-7xl mx-auto px-6 md:px-14 py-24">
            <div className="text-left mb-16">
                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-6"
                    style={{ fontFamily: '"Patrick Hand SC", cursive', color: 'var(--foreground)' }}
                >
                    My <span style={{ color: 'var(--accent)' }}>Skills</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className="text-xl md:text-2xl font-medium text-[var(--muted-foreground)] max-w-2xl leading-tight"
                    style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                >
                    A deep dive into my technical toolkit and expertise. Each skill represents a milestone in my journey as a creator and developer.
                </motion.p>
            </div>

            {skills.length === 0 ? (
                <div className="text-center py-20 text-xl" style={{ fontFamily: '"Patrick Hand SC", cursive', color: 'var(--foreground)' }}>
                    No skills found.
                </div>
            ) : (
                <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
                >
                    {skills.map((skill) => (
                        <motion.div 
                            key={skill.id} 
                            variants={item}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="group relative flex flex-col items-center justify-center p-6 md:p-8 rounded-[2.5rem] transition-all duration-500 overflow-hidden"
                            style={{ 
                                backgroundColor: 'transparent',
                                aspectRatio: '1/1'
                            }}
                        >
                            {/* Background Glow & Shine Effect */}
                            <div className="absolute inset-0 z-0 overflow-hidden rounded-[2.5rem] transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(16,132,162,0.1)]">
                                <div className="absolute inset-0 bg-[var(--card)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                {/* Shine Sweep */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <motion.div
                                        initial={{ x: '-150%', skewX: -25 }}
                                        whileHover={{ x: '150%' }}
                                        transition={{ duration: 0.75, ease: "circInOut" }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent w-full h-full"
                                    />
                                </div>
                            </div>

                            {/* Skill Icon */}
                            <div className="w-16 h-16 md:w-20 md:h-20 relative mb-4 z-10 group-hover:scale-110 transition-transform duration-500 drop-shadow-sm group-hover:drop-shadow-[0_10px_15px_rgba(0,0,0,0.1)]">
                                {skill.image ? (
                                    <Image 
                                        src={skill.image} 
                                        alt={skill.name} 
                                        fill 
                                        className="object-contain transition-all duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-3xl flex items-center justify-center text-[var(--muted-foreground)] font-bold text-2xl border-2 border-dashed border-[var(--border)] bg-[var(--muted)]">
                                        {skill.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            
                            {/* Skill Info */}
                            <h3 className="text-lg md:text-xl font-bold text-center w-full px-2 z-10 text-[var(--foreground)] leading-tight py-1" style={{ fontFamily: '"Patrick Hand SC", cursive' }} title={skill.name}>
                                {skill.name}
                            </h3>
                            
                            <div className="h-6 mt-1 flex items-center justify-center z-10">
                                {skill.level ? (
                                    <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent)' }}>
                                        {skill.level}
                                    </span>
                                ) : skill.experience ? (
                                    <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider px-3 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                                        {skill.experience}
                                    </span>
                                ) : null}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </section>
    );
}

