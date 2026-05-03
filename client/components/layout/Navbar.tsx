"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

/* ─── Navigation links ─────────────────────────────────────────── */
const navLinks = [
    { label: "Home", href: "/", num: "01" },
    { label: "Work", href: "/#work", num: "02" },
    { label: "About", href: "/#about", num: "03" },
    { label: "Contact", href: "/#contact", num: "04" },
];



import { Globe } from "lucide-react";
import { SocialLink } from "@/lib/admin/models/social_links.model";

/* ─── Ocean blue accent token ──────────────────────────────────── */
const OCEAN = "#1084a2";
const OCEAN_DARK = "rgba(16, 132, 162, 0.18)"; /* subtle tint for dark overlay */

/* ─── Component ────────────────────────────────────────────────── */
interface NavbarProps {
    socialLinks?: SocialLink[];
}

export default function Navbar({ socialLinks = [] }: NavbarProps) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    /* DOM refs */
    const topNavRef = useRef<HTMLElement>(null);
    const logoLetterARef = useRef<HTMLSpanElement>(null);
    const logoRestRef = useRef<HTMLSpanElement>(null);
    const logoHandRef = useRef<HTMLDivElement>(null);
    const desktopLinksRef = useRef<HTMLDivElement>(null);

    /* Scroll hamburger */
    const hambBtnRef = useRef<HTMLButtonElement>(null);

    /* Menu panel refs */
    const overlayRef = useRef<HTMLDivElement>(null);
    const darkPanelRef = useRef<HTMLDivElement>(null);
    const lightPanelRef = useRef<HTMLDivElement>(null);
    const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
    const socialRowRef = useRef<HTMLDivElement>(null);
    const closeBtnRef = useRef<HTMLButtonElement>(null);

    /* GSAP timelines */
    const menuTl = useRef<gsap.core.Timeline | null>(null);
    const clickTl = useRef<gsap.core.Timeline | null>(null);

    /* ── Scroll listener ──────────────────────────────────────── */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* ── Scroll hamburger reveal ──────────────────────────────── */
    useEffect(() => {
        if (!hambBtnRef.current) return;
        if (scrolled) {
            gsap.to(hambBtnRef.current, {
                scale: 1,
                opacity: 1,
                duration: 0.4,
                ease: "back.out(1.4)",
            });
        } else {
            gsap.to(hambBtnRef.current, {
                scale: 0.6,
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
            });
        }
    }, [scrolled]);

    /* ── Entry animation: Logo full sequence on load ──────────── */
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(logoLetterARef.current, { opacity: 1, y: 0 });
            gsap.set(logoHandRef.current, { opacity: 0, y: -900, x: 5 });

            const tl = gsap.timeline({ delay: 0.5 });

            tl.to(logoLetterARef.current, {
                y: window.innerHeight || 800,
                opacity: 0,
                duration: 1.0,
                ease: "power2.in",
            })
                .set(logoLetterARef.current, { y: -800, opacity: 1 })
                .set(logoHandRef.current, { y: -900, opacity: 0 })
                .to([logoHandRef.current, logoLetterARef.current], {
                    opacity: 1,
                    y: 0,
                    duration: 1.5,
                    ease: "power3.out",
                })
                .to(logoHandRef.current, {
                    y: -20,
                    duration: 0.4,
                    ease: "power2.out",
                })
                .to(logoHandRef.current, {
                    y: -900,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.in",
                }, "+=0.1");
        });
        return () => ctx.revert();
    }, []);

    /* ── Logo Click Animation ─────────────────────────────────── */
    const handleLogoClick = (e: React.MouseEvent) => {
        if (menuOpen) closeMenu();

        if (clickTl.current && clickTl.current.isActive()) return;

        clickTl.current = gsap.timeline();

        clickTl.current
            .to(logoLetterARef.current, {
                y: window.innerHeight || 800,
                opacity: 0,
                duration: 1.0,
                ease: "power2.in",
            })
            .set(logoLetterARef.current, { y: -800, opacity: 1 })
            .set(logoHandRef.current, { y: -900, opacity: 0 })
            .to([logoHandRef.current, logoLetterARef.current], {
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: "power3.out",
            })
            .to(logoHandRef.current, {
                y: -20,
                duration: 0.4,
                ease: "power2.out",
            })
            .to(logoHandRef.current, {
                y: -900,
                opacity: 0,
                duration: 0.8,
                ease: "power3.in",
            });
    };

    /* ── Menu open/close timeline ─────────────────────────────── */
    useEffect(() => {
        menuTl.current = gsap.timeline({ paused: true });

        menuTl.current
            .set(overlayRef.current, { display: "flex" })
            .fromTo(darkPanelRef.current,
                { xPercent: -100 },
                { xPercent: 0, duration: 0.6, ease: "power4.inOut" },
                0
            )
            .fromTo(lightPanelRef.current,
                { xPercent: 100 },
                { xPercent: 0, duration: 0.55, ease: "power4.inOut" },
                0.05
            )
            .fromTo(".menu-close-btn",
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)" },
                0.4
            )
            .fromTo(menuItemsRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.08 },
                0.3
            )
            .fromTo(socialRowRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
                0.65
            );

        return () => { menuTl.current?.kill(); };
    }, []);

    /* ── Toggle helpers ───────────────────────────────────────── */
    const openMenu = () => {
        setMenuOpen(true);
        menuTl.current?.play();
    };

    const closeMenu = () => {
        menuTl.current?.reverse().then(() => {
            setMenuOpen(false);
            gsap.set(overlayRef.current, { display: "none" });
        });
    };

    /* ── Desktop link hover (Wave animation) ──────────────────── */
    const handleWaveEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const chars = e.currentTarget.querySelectorAll(".link-char");
        gsap.killTweensOf(chars);
        gsap.to(chars, {
            y: -5,
            duration: 0.25,
            stagger: 0.04,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut"
        });
    };

    /* ─────────────────────────────────────────────────────────── */
    return (
        <>
            {/* ══ TOP NAVBAR ══ */}
            <nav
                ref={topNavRef}
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-14"
                style={{ fontFamily: '"Calistoga", serif' }}
            >
                {/* Logo */}
                <Link 
                    href="/" 
                    className={`flex items-center gap-0 relative transition-opacity duration-300 ${scrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`} 
                    onClick={handleLogoClick}
                >
                    <div
                        ref={logoHandRef}
                        className="absolute -top-12 left-[-40px] w-24 h-24 pointer-events-none z-10"
                        style={{ opacity: 0 }}
                        aria-hidden
                    >
                        <img
                            src="/hand.png"
                            alt=""
                            className="w-full h-full object-contain transform rotate-[-5deg]"
                        />
                    </div>

                    <span
                        ref={logoLetterARef}
                        className="text-[var(--foreground)] font-bold leading-none"
                        style={{ fontSize: "1.85rem", letterSpacing: "0.08em" }}
                    >
                        A
                    </span>

                    <span
                        ref={logoRestRef}
                        className="text-[var(--foreground)] font-bold leading-none"
                        style={{ fontSize: "1.85rem", letterSpacing: "0.08em" }}
                    >
                        LEN JAMES
                    </span>
                </Link>

                {/* Desktop nav links */}
                <div
                    ref={desktopLinksRef}
                    className={`hidden md:flex items-center gap-10 transition-opacity duration-300 ${scrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-lg font-medium transition-colors duration-200 flex"
                            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                            onMouseEnter={handleWaveEnter}
                        >
                            {link.label.split("").map((char, i) => (
                                <span key={i} className="link-char inline-block whitespace-pre">
                                    {char}
                                </span>
                            ))}
                        </Link>
                    ))}
                </div>

                {/* Mobile hamburger (before scroll) */}
                <button
                    className={`md:hidden flex items-center justify-center w-12 h-12 rounded-full relative z-[60] transition-all duration-300 ${scrolled ? "opacity-0 scale-50 pointer-events-none" : "opacity-100 scale-100"}`}
                    style={{ background: "var(--foreground)" }}
                    onClick={openMenu}
                    aria-label="Open menu"
                >
                    <div className="flex flex-col gap-[5px]">
                        <span className="block w-5 h-[1.5px] bg-[var(--background)]" />
                        <span className="block w-5 h-[1.5px] bg-[var(--background)]" />
                    </div>
                </button>
            </nav>

            {/* ══ SCROLL HAMBURGER ══ */}
            <button
                ref={hambBtnRef}
                onClick={openMenu}
                className="fixed top-5 right-6 md:top-8 md:right-10 z-50 flex items-center justify-center rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95"
                style={{
                    background: "var(--foreground)",
                    opacity: 0,
                    transform: "scale(0.6)",
                    width: "var(--hamb-size, 64px)",
                    height: "var(--hamb-size, 64px)",
                }}
                aria-label="Open menu"
            >
                <span className="flex flex-col gap-[6px]">
                    <span className="block w-6 h-[2px] bg-[var(--background)]" />
                    <span className="block w-6 h-[2px] bg-[var(--background)]" />
                </span>

                <style jsx>{`
          button {
            --hamb-size: 64px;
          }
          @media (min-width: 768px) {
            button {
              --hamb-size: 90px;
            }
          }
        `}</style>
            </button>

            {/* ══ MENU OVERLAY ══════════════════════════════════════════
                CHANGED: dark panel now uses a deep ocean blue tint instead
                of the previous rgba(0,0,0,0.7) charcoal overlay.
                Close button + social icons + active link all use #1084a2.
            ══════════════════════════════════════════════════════════ */}
            <div
                ref={overlayRef}
                className="fixed inset-0 z-[100] flex overflow-hidden"
                style={{ display: "none" }}
                aria-hidden={!menuOpen}
            >
                {/* ── Dark left panel — ocean blue tinted backdrop (desktop) ── */}
                <div
                    ref={darkPanelRef}
                    className="hidden md:block flex-shrink-0 relative overflow-hidden cursor-pointer"
                    style={{
                        width: "50%",
                        /* ✦ CHANGED: deep ocean night instead of pure black */
                        background: "linear-gradient(135deg, #062e3a 0%, #0a4f63 50%, #1084a2 100%)",
                    }}
                    onClick={closeMenu}
                >
                    {/* Subtle wave shimmer on the dark panel */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: "radial-gradient(ellipse at 30% 60%, rgba(16,132,162,0.25) 0%, transparent 65%)",
                        }}
                    />

                    {/* Desktop Close button — ocean blue */}
                    <button
                        onClick={(e) => { e.stopPropagation(); closeMenu(); }}
                        className="menu-close-btn absolute top-12 left-12 w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                        style={{
                            /* ✦ CHANGED: #1084a2 ocean blue */
                            background: OCEAN,
                            color: "#ffffff",
                        }}
                        aria-label="Close menu"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* ── Light right panel ── */}
                <div
                    ref={lightPanelRef}
                    className="flex-1 flex flex-col justify-center px-10 md:px-24 relative"
                    style={{ background: "var(--background)" }}
                >
                    {/* Mobile Close button — ocean blue */}
                    <button
                        onClick={closeMenu}
                        className="menu-close-btn md:hidden absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                        style={{
                            /* ✦ CHANGED: #1084a2 ocean blue */
                            background: OCEAN,
                            color: "#ffffff",
                        }}
                        aria-label="Close menu"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Nav links */}
                    <nav className="flex flex-col gap-6 mt-8">
                        {navLinks.map((link, i) => {
                            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                            /* ✦ CHANGED: active color is now ocean blue #1084a2 */
                            const linkColor = isActive ? OCEAN : "var(--foreground)";

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    ref={(el) => { menuItemsRef.current[i] = el; }}
                                    onClick={closeMenu}
                                    onMouseEnter={handleWaveEnter}
                                    className="group flex items-center gap-8 py-2 transition-colors duration-200"
                                    style={{ textDecoration: "none", opacity: 0 }}
                                >
                                    <span
                                        className="text-xl font-bold"
                                        style={{ color: linkColor, fontFamily: '"Calistoga", serif' }}
                                    >
                                        {link.num}
                                    </span>
                                    <span
                                        className="font-bold leading-none flex transition-colors duration-300"
                                        style={{
                                            fontSize: "clamp(3rem, 6vw, 4.5rem)",
                                            color: linkColor,
                                            fontFamily: '"Calistoga", serif',
                                            letterSpacing: "0.02em",
                                        }}
                                    >
                                        {link.label.toUpperCase().split("").map((char, index) => (
                                            <span key={index} className="link-char inline-block whitespace-pre">
                                                {char}
                                            </span>
                                        ))}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Social icons row — ocean blue background */}
                    <div ref={socialRowRef} className="flex items-center gap-3 mt-10" style={{ opacity: 0 }}>
                        {socialLinks.map((link) => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={link.platform}
                                title={link.platform}
                                className="group flex items-center justify-center w-10 h-10 rounded-full transition-transform hover:scale-110 overflow-hidden"
                                style={{
                                    /* ✦ CHANGED: #1084a2 ocean blue */
                                    background: OCEAN,
                                    color: "#ffffff",
                                }}
                            >
                                {link.icon_url ? (
                                    <img 
                                        src={link.icon_url} 
                                        alt={link.platform} 
                                        className="w-5 h-5 object-contain" 
                                    />
                                ) : (
                                    <Globe size={18} />
                                )}
                            </a>
                        ))}
                    </div>

                    {/* Footer */}
                    <p
                        className="mt-6 text-xs"
                        style={{ color: "var(--muted-foreground)", fontFamily: '"Calistoga", serif' }}
                    >
                        © {new Date().getFullYear()} Alen James — design with a human touch
                    </p>
                </div>
            </div>
        </>
    );
}