'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAME = 'Alen James';

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        const MIN_DISPLAY = 1800;
        const MAX_WAIT = 3000;
        const start = Date.now();

        const done = () => {
            const elapsed = Date.now() - start;
            const remaining = Math.max(0, MIN_DISPLAY - elapsed);
            setTimeout(() => {
                document.body.style.overflow = '';
                setIsLoading(false);
            }, remaining);
        };

        if (document.readyState === 'complete') {
            done();
        } else {
            const onLoad = () => done();
            window.addEventListener('load', onLoad);
            setTimeout(onLoad, MAX_WAIT);
            return () => window.removeEventListener('load', onLoad);
        }
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--background)]"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                >
                    <div className="flex items-end gap-0">
                        {NAME.split('').map((char, i) => (
                            <motion.span
                                key={i}
                                className="text-5xl md:text-7xl font-bold tracking-tight text-[var(--foreground)] select-none"
                                style={{
                                    fontFamily: '"Patrick Hand SC", cursive',
                                    display: 'inline-block',
                                    whiteSpace: char === ' ' ? 'pre' : 'normal',
                                    minWidth: char === ' ' ? '0.4em' : undefined,
                                }}
                                animate={{
                                    y: ['0%', '-22%', '0%'],
                                }}
                                transition={{
                                    duration: 1.1,
                                    ease: [0.45, 0, 0.55, 1],
                                    repeat: Infinity,
                                    repeatType: 'loop',
                                    delay: i * 0.08,
                                }}
                            >
                                {char}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}