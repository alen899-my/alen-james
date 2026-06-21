'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, HardHat, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Construction } from '@/lib/admin/models/constructions.model';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

interface ConstructionCard3DProps {
    item: Construction;
    index?: number;
}

export default function ConstructionCard3D({ item, index = 0 }: ConstructionCard3DProps) {
    return (
        <motion.div
            layout="position"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: Math.min(index * 0.05, 0.2) }}
        >
            <CardContainer
                containerClassName="py-0 w-full h-full"
                className="w-full group/card"
            >
                <CardBody className="relative aspect-[4/3] rounded-[2rem] overflow-hidden h-auto w-full p-0 border-none bg-transparent">
                    {/* Image */}
                    {item.main_image ? (
                        <Image
                            src={item.main_image}
                            alt={item.name}
                            fill
                            priority={index < 2}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--muted)]/50 to-[var(--card)]">
                            <span className="text-[var(--muted-foreground)]/50 font-bold uppercase tracking-widest text-xs">No Preview</span>
                        </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 md:opacity-80 md:group-hover/card:opacity-100 transition-opacity duration-300" />

                    {/* Phase / Status Badge */}
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg bg-black text-[#facc15] border border-black">
                        {item.is_upcoming ? (
                            <>
                                <Clock size={11} className="animate-spin" style={{ animationDuration: '3s' }} />
                                <span>Upcoming</span>
                            </>
                        ) : (
                            <>
                                <HardHat size={11} className="animate-bounce" />
                                <span>{item.construction_phase || 'Building'}</span>
                            </>
                        )}
                    </div>

                    {/* Content at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between translate-y-0 md:translate-y-2 md:group-hover/card:translate-y-0 transition-transform duration-300">
                        <div className="text-left flex-1 min-w-0 mr-4">
                            <CardItem
                                translateZ={50}
                                className="w-full"
                            >
                                <h3
                                    className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight truncate"
                                    style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                                >
                                    {item.name}
                                </h3>
                            </CardItem>

                            <CardItem
                                translateZ={60}
                                className="flex flex-wrap gap-1.5 mt-2 w-full"
                            >
                                {item.stacks?.map((tech, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center px-2 py-0.5 bg-white/10 rounded-md border border-white/5"
                                    >
                                        <span className="text-[9px] font-bold text-white/80 uppercase tracking-wider">{tech}</span>
                                    </div>
                                ))}
                            </CardItem>

                            {item.tagline && (
                                <CardItem
                                    translateZ={40}
                                    className="w-full"
                                >
                                    <p className="text-white/60 text-[10px] font-bold mt-1.5 uppercase tracking-[0.2em] line-clamp-1">{item.tagline}</p>
                                </CardItem>
                            )}
                        </div>

                        <CardItem
                            translateZ={70}
                            className="w-fit"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-white flex items-center justify-center text-black rotate-0 md:-rotate-45 md:group-hover/card:rotate-0 transition-transform duration-300 shadow-lg">
                                <ChevronRight size={20} />
                            </div>
                        </CardItem>
                    </div>

                    {/* Full-card link */}
                    <Link
                        href={`/under-construction/${item.id}`}
                        className="absolute inset-0 z-10"
                        aria-label={`View ${item.name}`}
                    />
                </CardBody>
            </CardContainer>
        </motion.div>
    );
}
