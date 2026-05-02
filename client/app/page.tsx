import Hero from "@/components/home/Hero";
import PointingHand from "@/components/home/PointingHand";
import TornPaperEdge from "@/components/home/TornPaperEdge";

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

                <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
                    {/* Centered Heading */}
                    <h2 
                        className="text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tight"
                        style={{ fontFamily: '"Calistoga", serif', lineHeight: 1 }}
                    >
                        About Me
                    </h2>

                    {/* Centered Intro Paragraph */}
                    <p className="text-2xl md:text-3xl font-bold max-w-3xl leading-tight">
                        Hi, I'm Alen – a friendly chap, designer, AI Specialist,Developer and analyst who loves solving real problems.
                    </p>

                    {/* Centered Body Text */}
                    <div className="space-y-6 max-w-4xl opacity-90 leading-relaxed text-lg md:text-xl font-medium mt-4">
                        <p>
                            My mission is to spice up design, stray away from the same hardcoded AI sites and trends, and inject personality into the work I create for brands and individuals.
                        </p>
                        <p>
                            Together we can exit the design 'comfort zone' and blast off into a world of daring design. I'm a keen communicator, so expect someone who can lead teams, convey big ideas to co-workers and clients, and guide projects towards success whatever the weather.
                        </p>
                        <p>
                            I was born in India and studied BTech Computer Science at KTU University. I'm always ready to embrace new challenges, and I can easily travel anywhere for convenience.
                        </p>
                    </div>

                    {/* Simple minimalist divider */}
                    <div className="w-12 h-1 bg-[var(--accent)] mt-4 rounded-full" />
                </div>
            </section>

            {/* Additional sections follow the same flow */}
            <section id="work" className="relative z-10 min-h-screen bg-[var(--background)] border-t border-[var(--border)] flex items-center justify-center">
                 <h2 className="text-4xl md:text-6xl opacity-10 uppercase font-bold tracking-widest" style={{ fontFamily: '"Calistoga", serif' }}>Selected Work</h2>
            </section>
        </main>
    );
}