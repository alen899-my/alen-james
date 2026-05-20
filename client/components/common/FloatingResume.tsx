'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface FloatingResumeProps {
    fileUrl: string;
    name?: string;
}

export default function FloatingResume({ fileUrl, name = 'Resume' }: FloatingResumeProps) {
    const [downloading, setDownloading] = useState(false);
    const [hovered, setHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 80, damping: 20 });
    const springY = useSpring(y, { stiffness: 80, damping: 20 });

    // Gentle idle floating animation
    useEffect(() => {
        let frame: number;
        let t = 0;
        const animate = () => {
            t += 0.015;
            y.set(Math.sin(t) * 8);
            x.set(Math.sin(t * 0.7) * 4);
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [x, y]);

    const handleDownload = async () => {
        if (downloading) return;
        setDownloading(true);
        try {
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${name}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            // Fallback: open in new tab
            window.open(fileUrl, '_blank');
        } finally {
            setTimeout(() => setDownloading(false), 1500);
        }
    };

    return (
        <motion.div
            ref={containerRef}
            style={{ x: springX, y: springY }}
            className="fixed bottom-8 right-8 z-50 cursor-pointer select-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 1.2 }}
            whileTap={{ scale: 0.92 }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            onClick={handleDownload}
            aria-label="Download Resume"
        >
            {/* Pulse ring */}
            <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ background: 'var(--accent)', borderRadius: '50%' }}
            />

            {/* Main circle */}
            <motion.div
                className="relative w-16 h-16 md:w-20 md:h-20 rounded-full flex flex-col items-center justify-center shadow-2xl overflow-hidden"
                animate={{
                    background: hovered
                        ? 'linear-gradient(135deg, #0d6e88, #0a5570)'
                        : 'linear-gradient(135deg, #1084a2, #0d6e88)',
                    boxShadow: hovered
                        ? '0 20px 50px rgba(16,132,162,0.55)'
                        : '0 10px 30px rgba(16,132,162,0.35)',
                }}
                transition={{ duration: 0.3 }}
            >
                {/* Shine on hover */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent"
                    animate={{ opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                />

                {/* Icon swap: idle = FileText, downloading = spinner, hover = Download */}
                <motion.div
                    className="relative z-10 flex flex-col items-center gap-0.5"
                    animate={{ scale: hovered ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    {downloading ? (
                        <motion.div
                            className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                        />
                    ) : hovered ? (
                        <Download size={22} className="text-white" strokeWidth={2.5} />
                    ) : (
                        <FileText size={20} className="text-white" strokeWidth={2} />
                    )}
                    <span className="text-[8px] font-black uppercase tracking-wider text-white/90 leading-none mt-0.5">
                        {downloading ? 'Getting...' : 'Resume'}
                    </span>
                </motion.div>
            </motion.div>

            {/* Tooltip */}
            <motion.div
                className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-[var(--foreground)] text-[var(--background)] text-xs font-black uppercase tracking-wider whitespace-nowrap pointer-events-none shadow-lg"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 10 }}
                transition={{ duration: 0.2 }}
            >
                Download {name}
                {/* Arrow */}
                <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[var(--foreground)] rotate-45 rounded-sm" />
            </motion.div>
        </motion.div>
    );
}
