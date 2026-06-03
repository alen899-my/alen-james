'use client';

import { ReactNode, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollingProps {
  children: ReactNode;
}

export default function SmoothScrolling({ children }: SmoothScrollingProps) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
      allowNestedScroll: true,
      anchors: true,
      autoRaf: true,
      autoToggle: true,
      stopInertiaOnNavigate: true,
    });

    // ── CRITICAL: Wire Lenis scroll → GSAP ScrollTrigger ──
    // Lenis overrides native scroll so ScrollTrigger won't fire without this.
    lenis.on('scroll', ScrollTrigger.update);

    // Store the ticker function reference so we can cleanly remove it later
    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };

    // Use GSAP's ticker to drive Lenis (no separate RAF loop needed)
    gsap.ticker.add(tickerFn);

    // Let Lenis handle all scroll smoothing — disable GSAP's own lag smoothing
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(tickerFn); // use same reference — properly cleans up
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
