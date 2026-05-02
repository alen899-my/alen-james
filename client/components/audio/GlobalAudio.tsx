'use client';

import { useEffect, useRef } from 'react';
import { useSound } from '@/context/SoundContext';

export default function GlobalAudio() {
    const { isSoundEnabled } = useSound();
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (!audioRef.current) return;

        if (isSoundEnabled) {
            audioRef.current.volume = 0;
            const playPromise = audioRef.current.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Fade in
                    let vol = 0;
                    const interval = setInterval(() => {
                        if (vol < 0.3) {
                            vol += 0.02;
                            if (audioRef.current) audioRef.current.volume = vol;
                        } else {
                            clearInterval(interval);
                        }
                    }, 50);
                }).catch(() => {
                    console.log("Global audio autoplay blocked.");
                });
            }
        } else {
            // Fade out
            let vol = audioRef.current.volume;
            const interval = setInterval(() => {
                if (vol > 0.02) {
                    vol -= 0.02;
                    if (audioRef.current) audioRef.current.volume = vol;
                } else {
                    if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current.volume = 0;
                    }
                    clearInterval(interval);
                }
            }, 50);
        }
    }, [isSoundEnabled]);

    return (
        <audio
            ref={audioRef}
            src="/bikesound.mp3" 
            loop
            preload="auto"
        />
    );
}
