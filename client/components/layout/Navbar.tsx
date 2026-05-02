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

/* ─── Social icon helpers ─────────────────────────────────────── */
const WhatsApp = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);
const Mail = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);
const LinkedIn = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" />
    </svg>
);
const Behance = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M7.799 5.698c.589 0 1.12.051 1.606.156.482.104.894.28 1.241.526.345.248.614.578.804.986.188.406.281.906.281 1.496 0 .642-.156 1.168-.469 1.594-.312.428-.762.768-1.344 1.02.814.234 1.419.641 1.812 1.219.393.576.591 1.273.591 2.093 0 .656-.13 1.222-.384 1.694-.254.474-.604.863-1.047 1.166-.443.303-.951.527-1.527.669-.576.142-1.163.214-1.762.214H0V5.698zm-.45 4.668c.467 0 .851-.109 1.147-.33.299-.22.448-.573.448-1.059 0-.267-.051-.492-.152-.674-.101-.181-.237-.327-.41-.438-.172-.112-.376-.191-.604-.24-.228-.048-.472-.074-.728-.074H3.071v2.815zm.205 4.882c.283 0 .55-.027.802-.081.253-.054.474-.145.666-.269.19-.122.343-.291.459-.506.117-.214.175-.49.175-.82 0-.651-.183-1.122-.547-1.405-.363-.283-.845-.426-1.44-.426H3.071v3.507zM20.766 5.698v1.737h-5.975V5.698zM24 15.208c0 .434-.033.854-.1 1.258h-7.42c.033.557.201 1.01.505 1.357.303.348.78.522 1.431.522.439 0 .819-.109 1.14-.327.32-.217.518-.455.592-.714h3.646c-.295.98-.842 1.752-1.641 2.316C20.954 20.183 19.986 20.5 18.85 20.5c-.755 0-1.434-.12-2.039-.362a4.54 4.54 0 0 1-1.574-1.028 4.671 4.671 0 0 1-1.019-1.614c-.239-.625-.358-1.32-.358-2.083 0-.75.115-1.437.347-2.061a4.661 4.661 0 0 1 1.003-1.63 4.615 4.615 0 0 1 1.577-1.069c.617-.257 1.306-.386 2.063-.386.793 0 1.494.134 2.098.4a4.333 4.333 0 0 1 1.531 1.1c.412.467.715 1.019.908 1.651.194.631.29 1.313.287 2.047zm-3.726-1.33c-.059-.48-.245-.881-.559-1.202-.315-.322-.756-.483-1.323-.483-.356 0-.659.058-.908.173-.249.116-.456.267-.621.452a2.03 2.03 0 0 0-.367.632 2.884 2.884 0 0 0-.154.428z" />
    </svg>
);

/* ─── Ocean blue accent token ──────────────────────────────────── */
const OCEAN = "#1084a2";
const OCEAN_DARK = "rgba(16, 132, 162, 0.18)"; /* subtle tint for dark overlay */

/* ─── Component ────────────────────────────────────────────────── */
export default function Navbar() {
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
                        {[
                            { icon: <WhatsApp />, label: "WhatsApp" },
                            { icon: <Mail />, label: "Email" },
                            { icon: <LinkedIn />, label: "LinkedIn" },
                            { icon: <Behance />, label: "Behance" },
                        ].map(({ icon, label }) => (
                            <a
                                key={label}
                                href="#"
                                aria-label={label}
                                className="flex items-center justify-center w-10 h-10 rounded-full transition-transform hover:scale-110"
                                style={{
                                    /* ✦ CHANGED: #1084a2 ocean blue */
                                    background: OCEAN,
                                    color: "#ffffff",
                                }}
                            >
                                {icon}
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