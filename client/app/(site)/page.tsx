import Hero from "@/components/home/Hero";
import PointingHand from "@/components/home/PointingHand";
import TornPaperEdge from "@/components/home/TornPaperEdge";
import AboutMe from "@/components/home/AboutMe";
import CallMeBaby from "@/components/home/CallMeBaby";
import Works from "@/components/home/Works";
import WhyWorkWithMe from "@/components/home/WhyWorkWithMe";
import Footer from "@/components/layout/Footer";
import { getAllWorks } from "@/lib/admin/models/works.model";
import { getAllWorkCategories } from "@/lib/admin/models/work_categories.model";
import { getAllSocialLinks } from "@/lib/admin/models/social_links.model";

export default async function Page() {
    const [works, categories, socialLinks] = await Promise.all([
        getAllWorks(),
        getAllWorkCategories(),
        getAllSocialLinks(),
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

            <WhyWorkWithMe />

            {/* Footer */}
            <Footer socialLinks={socialLinks} />
        </main>
    );
}



