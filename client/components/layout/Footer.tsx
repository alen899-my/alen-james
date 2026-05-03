import React from 'react';
import Link from 'next/link';
import { SocialLink } from '@/lib/admin/models/social_links.model';
import { Mail, Globe } from 'lucide-react';

interface FooterProps {
    socialLinks?: SocialLink[];
}

const Footer = ({ socialLinks = [] }: FooterProps) => {
    return (
        <footer className="relative z-20 w-full bg-[#0d1117] text-[#f0ede6] pt-32 pb-12 px-6 md:px-14 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                {/* ── LET'S WORK TOGETHER ── */}
                <h2 
                    className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-8"
                    style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                >
                    Let's work<br />together
                </h2>

                <div className="space-y-4 mb-16">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#8b9aaa]">Connect with me</p>
                    <a 
                        href="mailto:alenjames899@gmail.com" 
                        className="text-2xl md:text-4xl font-bold hover:text-[#1084a2] transition-colors lowercase"
                    >
                        alenjames899@gmail.com
                    </a>
                </div>

                {/* ── SOCIALS ── */}
                <div className="flex flex-wrap justify-center gap-6 mb-32">
                    {socialLinks.map((link) => (
                        <a 
                            key={link.id}
                            href={link.url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-full border border-[#8b9aaa]/30 flex items-center justify-center hover:bg-[#1084a2] hover:border-[#1084a2] transition-all overflow-hidden"
                            title={link.platform}
                        >
                            {link.icon_url ? (
                                <img 
                                    src={link.icon_url} 
                                    alt={link.platform} 
                                    className="w-5 h-5 object-contain invert brightness-0 group-hover:brightness-100" 
                                />
                            ) : (
                                <Globe size={20} />
                            )}
                        </a>
                    ))}
                </div>

                {/* ── BOTTOM BAR ── */}
                <div className="w-full pt-12 border-t border-[#8b9aaa]/10 flex flex-col md:flex-row justify-between items-center gap-8 text-xs font-medium tracking-widest text-[#8b9aaa] uppercase">
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <p>© 2025 ALEN JAMES</p>
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
