'use client';

import { useEffect, useState } from 'react';

const NAME = 'Alen James';

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    // Start hide sequence after the wave animation plays
    const hideTimer = setTimeout(() => setHiding(true), 2400);
    const removeTimer = setTimeout(() => setVisible(false), 3000);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes aj-wave {
          0%   { transform: translateY(0px) rotate(0deg); opacity: 0; }
          20%  { opacity: 1; }
          50%  { transform: translateY(-18px) rotate(-4deg); }
          80%  { transform: translateY(6px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); opacity: 1; }
        }

        @keyframes aj-fade-in-char {
          from { opacity: 0; transform: translateY(40px) scale(0.8); }
          to   { opacity: 1; transform: translateY(0px) scale(1); }
        }

        @keyframes aj-loader-exit {
          0%   { opacity: 1; transform: scale(1); }
          60%  { opacity: 1; transform: scale(1.04); }
          100% { opacity: 0; transform: scale(0.96); }
        }

        @keyframes aj-shimmer {
          0%   { background-position: -400% center; }
          100% { background-position: 400% center; }
        }

        @keyframes aj-glow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.95); }
          50%       { opacity: 0.7; transform: scale(1.05); }
        }

        .aj-loader-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fdf8e1;
          animation: ${hiding ? 'aj-loader-exit 0.6s cubic-bezier(0.4,0,0.2,1) forwards' : 'none'};
        }

        .dark .aj-loader-overlay {
          background: #000000;
        }

        .aj-glow {
          position: absolute;
          width: 420px;
          height: 160px;
          background: radial-gradient(ellipse at center, rgba(16,132,162,0.25) 0%, transparent 70%);
          border-radius: 50%;
          animation: aj-glow-pulse 2s ease-in-out infinite;
          pointer-events: none;
        }

        .aj-text-wrap {
          display: flex;
          align-items: baseline;
          gap: 0;
          position: relative;
          z-index: 1;
        }

        .aj-char {
          display: inline-block;
          font-family: "Calistoga", serif;
          font-size: clamp(3rem, 10vw, 6rem);
          font-weight: 400;
          letter-spacing: -0.01em;
          color: transparent;
          background: linear-gradient(
            90deg,
            #0d6e87 0%,
            #1084a2 25%,
            #2d2a21 50%,
            #1084a2 75%,
            #0d6e87 100%
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          animation:
            aj-fade-in-char 0.5s cubic-bezier(0.34,1.56,0.64,1) both,
            aj-wave 1.2s ease-in-out 0.5s both,
            aj-shimmer 3s linear 0.4s infinite;
          will-change: transform, opacity;
        }

        .aj-char-space {
          display: inline-block;
          width: 0.35em;
        }

        .aj-subtitle {
          position: absolute;
          bottom: -2.2rem;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          font-family: "Patrick Hand SC", cursive;
          font-size: clamp(0.75rem, 2vw, 1rem);
          color: #1084a2;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          opacity: 0;
          animation: aj-fade-in-char 0.5s ease 1.4s forwards;
        }

        .dark .aj-subtitle {
          color: #1a9bbf;
        }

        .aj-dots {
          position: absolute;
          bottom: -4rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          opacity: 0;
          animation: aj-fade-in-char 0.4s ease 1.8s forwards;
        }

        .aj-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #1084a2;
          animation: aj-glow-pulse 0.8s ease-in-out infinite;
        }

        .dark .aj-dot {
          background: #1a9bbf;
        }
      `}</style>

      <div className="aj-loader-overlay dark:bg-black">
        <div className="aj-glow" />

        <div style={{ position: 'relative' }}>
          <div className="aj-text-wrap" aria-label="Alen James">
            {NAME.split('').map((char, i) => {
              if (char === ' ') {
                return <span key={i} className="aj-char-space" />;
              }
              return (
                <span
                  key={i}
                  className="aj-char"
                  style={{
                    animationDelay: `${i * 0.06}s, ${i * 0.06 + 0.5}s, ${i * 0.04 + 0.4}s`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>

          <p className="aj-subtitle">Designer · Developer · AI Specialist</p>

          <div className="aj-dots">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="aj-dot"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
