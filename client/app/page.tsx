import Hero from "@/components/home/Hero";

export default function Page() {
    return (
        <main className="flex flex-col bg-[var(--background)] relative">
            {/* 
                Pinned Hero: stays in place while other sections slide over it.
                This creates the "slowly put top" / overlay effect you described.
            */}
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
                {/* ── TORN PAPER EDGE EFFECT ── */}
                <div 
                    className="absolute top-0 left-0 w-full h-16 -translate-y-[95%] pointer-events-none"
                    style={{
                        background: '#fdf8e1',
                        clipPath: 'polygon(0% 100%, 5% 85%, 10% 95%, 15% 80%, 20% 90%, 25% 75%, 30% 88%, 35% 72%, 40% 92%, 45% 78%, 50% 95%, 55% 82%, 60% 90%, 65% 75%, 70% 88%, 75% 70%, 80% 92%, 85% 80%, 90% 95%, 95% 82%, 100% 100%)',
                        zIndex: 11,
                    }}
                />

                <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
                    {/* Centered Heading */}
                    <h2 
                        className="text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tight"
                        style={{ fontFamily: '"Calistoga", serif', lineHeight: 1 }}
                    >
                        About Me
                    </h2>

                    {/* Centered Intro Paragraph */}
                    <p className="text-2xl md:text-3xl font-bold max-w-2xl leading-tight">
                        Hi, I'm Alen James – a friendly developer and designer who loves problem-solving and high-fidelity interactions.
                    </p>

                    {/* Centered Body Text */}
                    <div className="space-y-6 max-w-3xl opacity-80 leading-relaxed text-lg md:text-xl font-medium">
                        <p>
                            My mission is to bridge the gap between human intuition and technical precision. I strive to inject personality into every digital experience I create, ensuring it feels alive and tactile.
                        </p>
                        <p>
                            Together we can exit the design 'comfort zone' and blast off into a world of daring, high-fidelity web applications. I'm a keen communicator, so expect a transparent and collaborative journey.
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