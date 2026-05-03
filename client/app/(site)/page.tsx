import Hero from "@/components/home/Hero";
import PointingHand from "@/components/home/PointingHand";
import TornPaperEdge from "@/components/home/TornPaperEdge";
import AboutMe from "@/components/home/AboutMe";
import CallMeBaby from "@/components/home/CallMeBaby";
import Works from "@/components/home/Works";
import { getAllWorks } from "@/lib/admin/models/works.model";
import { getAllWorkCategories } from "@/lib/admin/models/work_categories.model";

export default async function Page() {
    const [works, categories] = await Promise.all([
        getAllWorks(),
        getAllWorkCategories(),
    ]);

    return (
        <main className="flex flex-col relative w-full" style={{ background: '#fdf8e1' }}>
            <div className="sticky top-0 w-full h-screen z-0">
                <Hero />
            </div>
            {/* 
                About Section: Slides UP over the Hero.
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

            {/* CTA Section */}
            <CallMeBaby />

            {/* Works Section */}
            <section id="work" className="relative z-10 min-h-screen bg-[var(--background)]">
                 <Works works={works} categories={categories} />
            </section>
        </main>
    );
}


