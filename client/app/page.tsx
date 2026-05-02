import Hero from "@/components/home/Hero";

export default function Page() {
    return (
        <main className="flex flex-col relative" style={{ background: '#fdf8e1' }}>
            <div className="sticky top-0 h-screen z-0">
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
                className="relative z-10 min-h-screen pt-32 pb-24 px-6 md:px-14 flex flex-col items-center text-center"
                style={{ 
                    background: '#fdf8e1', /* Warm cream paper color */
                    color: '#1a1a1a',      /* Deep ink-like black */
                }}
            >
                {/* ── OCEAN WAVE EDGE EFFECT ── */}
                <div 
                    className="absolute top-0 left-0 w-full h-16 md:h-24 -translate-y-[98%] pointer-events-none drop-shadow-[0_-10px_20px_rgba(0,0,0,0.15)]"
                    style={{ zIndex: 11 }}
                >
                    <svg viewBox="0 0 1440 100" className="w-full h-full block" preserveAspectRatio="none">
                        <path fill="var(--accent)" d="M0,50 C320,120 420,-20 740,50 C1060,120 1120,-20 1440,50 L1440,100 L0,100 Z" />
                    </svg>
                </div>

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