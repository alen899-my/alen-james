import Hero from "@/components/home/Hero";
import PointingHand from "@/components/home/PointingHand";
import TornPaperEdge from "@/components/home/TornPaperEdge";
import AboutMe from "@/components/home/AboutMe";

export default function Page() {
    return (
        <main className="flex flex-col relative w-full" style={{ background: '#fdf8e1' }}>
            <div className="sticky top-0 w-full h-screen z-0">
                <Hero />
            </div>
            {/* 
                About Section: Slides UP over the Hero.
                The shadow-[-20px] adds depth to the "sliding over" feel.
            */}
            {/* 
                About Section: Redesigned with a "Paper-like UI"
                Features a jagged/torn top edge and centered typography.
            */}
            <section 
                id="about" 
                className="relative z-10 w-full min-h-screen pt-32 pb-24 px-6 md:px-14 flex flex-col items-center text-center"
                style={{ 
                    background: 'var(--background)', 
                    color: 'var(--foreground)',
                }}
            >
                {/* ── TORN PAPER EDGE EFFECT ── */}
                <TornPaperEdge />

                {/* ── POINTING HAND ── */}
                <PointingHand />

                <AboutMe />
            </section>

            {/* Additional sections follow the same flow */}
            <section id="work" className="relative z-10 min-h-screen bg-[var(--background)] border-t border-[var(--border)] flex items-center justify-center">
                 <h2 className="text-4xl md:text-6xl opacity-10 uppercase font-bold tracking-widest" style={{ fontFamily: '"Calistoga", serif' }}>Selected Work</h2>
            </section>
        </main>
    );
}