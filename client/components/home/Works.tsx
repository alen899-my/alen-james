'use client';

import React, { useState, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Work } from '@/lib/admin/models/works.model';

import { WorkCategory } from '@/lib/admin/models/work_categories.model';
import WorkCard from '@/components/work/WorkCard';
import gsap from 'gsap';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface WorksProps {
    works: Work[];
    categories: WorkCategory[];
}

export default function Works({ works, categories }: WorksProps) {
    const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
    const containerRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);

    const filteredWorks = selectedCategory === 'all' 
        ? works 
        : works.filter(work => work.category_id === selectedCategory);

    // Show only first 6 on home page
    const displayedWorks = filteredWorks.slice(0, 6);

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
                    style={{ fontFamily: '"Patrick Hand SC", cursive', color: 'var(--foreground)' }}
                >
                    My Work
                </h2>
                <p className="text-xl md:text-2xl font-medium text-[var(--muted-foreground)] max-w-2xl leading-tight">
                    Here's a sample of my work – take a look! I'll let you in on a secret... I have a lot more cool stuff in the works! If you want to see, just pop me a message.
                </p>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 mb-12">
                <button
                    onClick={() => { setSelectedCategory('all'); }}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 bg-[#1084a2] text-white ${
                        selectedCategory === 'all' 
                        ? 'shadow-lg scale-105' 
                        : 'hover:scale-105'
                    }`}
                >
                    All
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.id); }}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 bg-[#1084a2] text-white ${
                            selectedCategory === cat.id 
                            ? 'shadow-lg scale-105' 
                            : 'hover:scale-105'
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
                    {displayedWorks.map((work, index) => (
                        <WorkCard key={work.id} work={work} index={index} />
                    ))}
                </AnimatePresence>

            </motion.div>

            {/* View All Projects Button */}
            <div className="mt-16 flex flex-col items-center gap-6">
          
                <Link 
                    href="/all-works"
                    className="group flex items-center gap-3 px-8 py-4 rounded-full bg-[var(--foreground)] text-[var(--background)] text-lg font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                    style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                >
                    <span>View All Works</span>
                    <div className="w-6 h-6 shrink-0 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/40 transition-colors">
                        <ChevronRight size={14} />
                    </div>
                </Link>
            </div>


            {filteredWorks.length === 0 && (
                <div className="py-24 text-center">
                    <p className="text-[var(--muted-foreground)]/40 font-bold uppercase tracking-widest">No Works in this category yet.</p>
                </div>
            )}
        </div>
    );
}

