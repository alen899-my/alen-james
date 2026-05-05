'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import {
    Briefcase, GraduationCap, Code2, Users, Notebook,
    PenTool, MapPin, Archive, LucideIcon
} from 'lucide-react';

interface MoreLink {
    href: string;
    label: string;
    icon: LucideIcon;
    desc: string;
    image: string;
    isWide?: boolean;
}

const MORE_LINKS: MoreLink[] = [
    { href: '/experiences', label: 'JOB', icon: Briefcase, desc: 'My professional journey and career milestones.', image: '/moreimages/myjobscard.png' },
    { href: '/education', label: 'EDUCATION', icon: GraduationCap, desc: 'Academic background and continuous learning.', image: '/moreimages/educationcard.png' },
    { href: '/skills', label: 'SKILLS', icon: Code2, desc: 'A deep dive into my technical toolkit.', image: '/moreimages/myskillscard.png' },
    { href: '/people', label: 'PEOPLE', icon: Users, desc: 'Stories of the amazing individuals I\'ve met.', image: '/moreimages/peopleimetcard.png' },
    { href: '/diaries', label: 'MY DIARY', icon: Notebook, desc: 'Personal reflections and daily musings.', image: '/moreimages/mydairycard.png' },
    { href: '/blogs', label: 'BLOGS', icon: PenTool, desc: 'Articles on design, code, and technology.', image: '/moreimages/blogcard.png' },
    { href: '/travels', label: 'TRAVEL LOG', icon: MapPin, desc: 'Stories and snapshots from my adventures.', image: '/moreimages/travelcard.png', isWide: true },
    { href: '/regrets', label: 'REGRETS', icon: Archive, desc: 'Lessons learned and paths not taken.', image: '/moreimages/myregretscard.png', isWide: true },
];

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item: Variants = {
    hidden: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function MoreClient() {
    return (
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
            {MORE_LINKS.map((link) => (
                <motion.div 
                    key={link.href} 
                    variants={item}
                >
                    <Link href={link.href} className="block group h-full">
                        <div 
                            className="relative h-[300px] md:h-[350px] rounded-[2rem] overflow-hidden bg-white shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0">
                                <img 
                                    src={link.image} 
                                    alt={link.label}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Dark Overlay (Matching WorkCard) */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 md:opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 h-full p-8 md:p-12 flex flex-col justify-end items-start text-left">
                                
                                <h3 
                                    className="text-4xl md:text-6xl font-black mb-2 tracking-tighter text-white uppercase"
                                    style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                                >
                                    {link.label}
                                </h3>
                                <p 
                                    className="text-base md:text-xl leading-tight text-white/80 mb-6 font-medium max-w-xl"
                                    style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                                >
                                    {link.desc}
                                </p>

                                {/* Accent Line */}
                                <div className="w-12 h-[4px] bg-[var(--accent)] rounded-full opacity-60 group-hover:w-20 group-hover:opacity-100 transition-all duration-300" />
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );
}
