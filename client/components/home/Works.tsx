'use client';

import React, { useState, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Work } from '@/lib/admin/models/works.model';

import { WorkCategory } from '@/lib/admin/models/work_categories.model';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface WorksProps {
    works: Work[];
    categories: WorkCategory[];
}

export default function Works({ works, categories }: WorksProps) {
    const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
    const [showAll, setShowAll] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);

    const filteredWorks = selectedCategory === 'all' 
        ? works 
        : works.filter(work => work.category_id === selectedCategory);

    const displayedWorks = showAll ? filteredWorks : filteredWorks.slice(0, 5);

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            gsap.from(headingRef.current, {
                scrollTrigger: {
                    trigger: headingRef.current,
                    start: "top 90%",
                    toggleActions: "play none none none"
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="w-full max-w-7xl mx-auto px-6 md:px-14 py-24">
            <div className="text-left mb-16">
                <h2 
                    ref={headingRef}
                    className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6"
                    style={{ fontFamily: '"Patrick Hand SC", cursive', color: '#1a1a1a' }}
                >
                    My Work
                </h2>
                <p className="text-xl md:text-2xl font-medium text-[#1a1a1a]/70 max-w-2xl leading-tight">
                    Here's a sample of my work – take a look! I'll let you in on a secret... I have a lot more cool stuff in the works! If you want to see, just pop me a message.
                </p>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 mb-12">
                <button
                    onClick={() => { setSelectedCategory('all'); setShowAll(false); }}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                        selectedCategory === 'all' 
                        ? 'bg-[#1084a2] text-white shadow-lg scale-105' 
                        : 'bg-[#1084a2]/10 text-[#1084a2] hover:bg-[#1084a2]/20'
                    }`}
                >
                    All
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.id); setShowAll(false); }}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                            selectedCategory === cat.id 
                            ? 'bg-[#1084a2] text-white shadow-lg scale-105' 
                            : 'bg-[#1084a2]/10 text-[#1084a2] hover:bg-[#1084a2]/20'
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Works Grid */}
            <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                <AnimatePresence mode='popLayout'>
                    {displayedWorks.map((work) => (
                        <motion.div
                            key={work.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, ease: "circOut" }}
                            className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-[#f0ede6] border border-[#e8e2d5] shadow-sm hover:shadow-xl transition-all duration-500"
                        >
                            {/* Image */}
                            {work.main_image ? (
                                <img 
                                    src={work.main_image} 
                                    alt={work.title}
                                    className="w-full h-full object-contain transition-transform duration-700 bg-white"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#fdfbf7] to-[#f0ede6]">
                                    <span className="text-[#c4bdb0] font-bold uppercase tracking-widest text-xs">No Preview</span>
                                </div>
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <div className="text-left">
                                    <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                                        {work.title}
                                    </h3>
                                    {work.subtitle && (
                                        <p className="text-white/70 text-sm font-medium mt-1 uppercase tracking-wider">{work.subtitle}</p>
                                    )}
                                </div>
                                <div className="w-12 h-12 shrink-0 rounded-full bg-white flex items-center justify-center text-black -rotate-45 group-hover:rotate-0 transition-transform duration-500 shadow-lg">
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
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* View More Button */}
            {!showAll && filteredWorks.length > 5 && (
                <div className="mt-16 flex justify-center">
                    <button 
                        onClick={() => setShowAll(true)}
                        className="group flex items-center gap-3 px-8 py-4 rounded-full bg-[#1a1a1a] text-white text-lg font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                        style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                    >
                        <span>View All Projects</span>
                        <div className="w-6 h-6 shrink-0 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/40 transition-colors">
                            <ChevronRight size={14} />
                        </div>
                    </button>
                </div>
            )}

            {filteredWorks.length === 0 && (
                <div className="py-24 text-center">
                    <p className="text-[#1a1a1a]/40 font-bold uppercase tracking-widest">No projects in this category yet.</p>
                </div>
            )}
        </div>
    );
}

