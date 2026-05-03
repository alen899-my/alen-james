'use client';

import React, { useState, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Work } from '@/lib/admin/models/works.model';
import { WorkCategory } from '@/lib/admin/models/work_categories.model';
import WorkCard from './WorkCard';
import gsap from 'gsap';

interface WorksListProps {
    initialWorks: Work[];
    categories: WorkCategory[];
}

export default function WorksList({ initialWorks, categories }: WorksListProps) {
    const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
    const containerRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);

    const filteredWorks = selectedCategory === 'all' 
        ? initialWorks 
        : initialWorks.filter(work => work.category_id === selectedCategory);

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            gsap.from(headingRef.current, {
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
                <h1 
                    ref={headingRef}
                    className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-6"
                    style={{ fontFamily: '"Patrick Hand SC", cursive', color: '#1a1a1a' }}
                >
                    Full Works
                </h1>
                <p className="text-xl md:text-2xl font-medium text-[#1a1a1a]/70 max-w-2xl leading-tight">
                    Explore my complete collection of Works across various disciplines. Each project represents a unique challenge solved with creativity and technical expertise.
                </p>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 mb-16">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 bg-[#1084a2] text-white ${
                        selectedCategory === 'all' 
                        ? 'shadow-lg scale-105' 
                        : 'hover:scale-105'
                    }`}
                >
                    All Projects
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
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
                className="grid grid-cols-1 md:grid-cols-2 gap-12"
            >
                <AnimatePresence mode='popLayout'>
                    {filteredWorks.map((work, index) => (
                        <WorkCard key={work.id} work={work} index={index} />
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredWorks.length === 0 && (
                <div className="py-32 text-center">
                    <p className="text-2xl md:text-4xl font-black uppercase tracking-tight text-[#1a1a1a]/20" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                        No projects found in this category... yet!
                    </p>
                </div>
            )}
        </div>
    );
}
