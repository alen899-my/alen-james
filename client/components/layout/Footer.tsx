import React from 'react';
import Link from 'next/link';
import { SocialLink } from '@/lib/admin/models/social_links.model';
import { Globe } from 'lucide-react';
import GithubCommitMapClient from "@/components/home/GithubCommitMapClient";
import { getContributionCalendars } from "@/lib/github";

interface FooterProps {
    socialLinks?: SocialLink[];
}

const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "alen899-my";

const Footer = async ({ socialLinks = [] }: FooterProps) => {
    const calendars = await getContributionCalendars(GITHUB_USERNAME);

    return (
        <footer
            className="relative z-20 w-full bg-[#0d1117] text-[#f0ede6] pt-32 pb-12 px-6 md:px-14 overflow-hidden"
            style={{
                '--background': '#0d1117',
                '--foreground': '#f0ede6',
                '--accent': '#1084a2',
                '--muted-foreground': '#8b9aaa',
                '--border': 'rgba(139, 154, 170, 0.15)',
            } as React.CSSProperties}
        >
            {/* ── HEATMAP BACKGROUND ── */}
            <GithubCommitMapClient
                calendars={calendars}
                username={GITHUB_USERNAME}
                variant="background"
            />

            {/* ── TOP TORN EDGE ── */}
            <div className="absolute top-0 left-0 w-full h-12 md:h-16 -translate-y-[98%] pointer-events-none select-none overflow-hidden" style={{ zIndex: 20 }}>
                <svg 
                    viewBox="0 0 1440 60" 
                    className="w-full h-full block" 
                    preserveAspectRatio="none"
                >
                    <path 
                        fill="#0d1117" 
                        d="M0,60 L0,30 L15,31 L30,29 L45,32 L60,30 L75,28 L90,31 L105,29 L120,30 L135,32 L150,28 L165,30 L180,31 L195,29 L210,32 L225,30 L240,28 L255,31 L270,29 L285,30 L300,32 L315,28 L330,30 L345,31 L360,29 L375,32 L390,30 L405,28 L420,31 L435,29 L450,30 L465,32 L480,28 L495,30 L510,31 L525,29 L540,32 L555,30 L570,28 L585,31 L600,29 L615,30 L630,32 L645,28 L660,30 L675,31 L690,29 L705,32 L720,30 L735,28 L750,31 L765,29 L780,30 L795,32 L810,28 L825,30 L840,31 L855,29 L870,32 L885,30 L900,28 L915,31 L930,29 L945,30 L960,32 L975,28 L990,30 L1005,31 L1020,29 L1035,32 L1050,30 L1065,28 L1080,31 L1095,29 L1110,30 L1125,32 L1140,28 L1155,30 L1170,31 L1185,29 L1200,32 L1215,30 L1230,28 L1245,31 L1260,29 L1275,30 L1290,32 L1305,28 L1320,30 L1335,31 L1350,29 L1365,32 L1380,30 L1395,28 L1410,31 L1425,29 L1440,30 L1440,60 Z" 
                    />
                </svg>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
                {/* ── LET'S WORK TOGETHER ── */}
                <h2 
                    className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-8"
                    style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                >
                    Let's work<br />together
                </h2>

                <div className="space-y-4 mb-16">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#8b9aaa]">Connect with me</p>
                    <div className="flex flex-col items-center gap-4">
                        <a 
                            href="mailto:alenjames899@gmail.com" 
                            className="text-2xl md:text-4xl font-bold  text-[#1084a2] transition-colors lowercase"
                            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                        >
                            alenjames899@gmail.com
                        </a>
                        <a 
                            href="https://wa.me/918921837945" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-xl md:text-3xl font-bold text-[#25D366] transition-colors"
                            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                        >
                            <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 md:w-8 md:h-8">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                            </svg>
                            +91 89218 37945
                        </a>
                    </div>
                </div>

                {/* ── SOCIALS ── */}
                <div className="flex flex-wrap justify-center gap-6 mb-16">
                    {socialLinks.map((link) => (
                        <a 
                            key={link.id}
                            href={link.url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group w-12 h-12 rounded-full border border-[#8b9aaa]/30 flex items-center justify-center hover:bg-[#1084a2] hover:border-[#1084a2] transition-all overflow-hidden"
                            title={link.platform}
                        >
                            {link.icon_url ? (
                                <img 
                                    src={link.icon_url} 
                                    alt={link.platform} 
                                    className="w-5 h-5 object-contain" 
                                />
                            ) : (
                                <Globe size={20} className="text-[#8b9aaa] group-hover:text-white transition-colors" />
                            )}
                        </a>
                    ))}
                </div>

                {/* ── BOTTOM BAR ── */}
                <div className="w-full pt-12 border-t border-[#8b9aaa]/10 flex flex-col md:flex-row justify-between items-center gap-8 text-xs font-medium tracking-widest text-[#8b9aaa] uppercase">
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <p>© 2026 ALEN JAMES</p>
                        <p>Made with love and creative juices</p>
                    </div>

                    <nav className="flex gap-8">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <Link href="/#about" className="hover:text-white transition-colors">About</Link>
                        <Link href="/#work" className="hover:text-white transition-colors">Work</Link>
                        <Link href="/#contact" className="hover:text-white transition-colors">Contact</Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
};


export default Footer;
