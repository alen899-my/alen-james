// Revalidate every 5 minutes instead of 0 — avoids DB hit on every single request
export const revalidate = 300;

import dynamic from 'next/dynamic';
import PointingHand from "@/components/home/PointingHand";
import TornPaperEdge from "@/components/home/TornPaperEdge";
import AboutMe from "@/components/home/AboutMe";
import CallMeBaby from "@/components/home/CallMeBaby";
import WhyWorkWithMe from "@/components/home/WhyWorkWithMe";
import MoreAboutMeBanner from "@/components/home/MoreAboutMeBanner";
import Footer from "@/components/layout/Footer";
import { getAllWorksMinimal } from "@/lib/admin/models/works.model";
import { getAllWorkCategories } from "@/lib/admin/models/work_categories.model";
import { getAllSocialLinks } from "@/lib/admin/models/social_links.model";
import { getActiveResume } from "@/lib/admin/models/resumes.model";
import { getActiveWhatsNew } from "@/lib/admin/models/whats_new.model";
import ConstructionBanner from "@/components/common/ConstructionBanner";

// Dynamically imported heavy components
const Hero = dynamic(() => import('@/components/home/Hero'), { ssr: false, loading: () => <div className="min-h-screen" /> });
const Works = dynamic(() => import('@/components/home/Works'), { ssr: false, loading: () => <div className="min-h-screen" /> });
const GithubCommitMapClient = dynamic(() => import('@/components/home/GithubCommitMapClient'), { ssr: false, loading: () => null });
const MediaCarousel = dynamic(() => import('@/components/home/MediaCarousel'), { ssr: false, loading: () => null });
const FloatingResume = dynamic(() => import('@/components/common/FloatingResume'), { ssr: false, loading: () => null });
const WhatsNewPopup = dynamic(() => import('@/components/common/WhatsNewPopup'), { ssr: false, loading: () => null });

export default async function Page() {
  // Use minimal dataset for listing to reduce payload & processing
  const [works, categories, socialLinks, activeResume, activeWhatsNew] = await Promise.all([
    getAllWorksMinimal(),
    getAllWorkCategories(),
    getAllSocialLinks(),
    getActiveResume(),
    getActiveWhatsNew(),
  ]);

  return (
    <main className="flex flex-col relative w-full" style={{ background: 'var(--background)' }}>
      <div className="sticky top-0 w-full h-screen z-0">
        <Hero />
      </div>

      <section
        id="about"
        className="relative z-10 w-full min-h-screen pt-32 pb-24 px-6 md:px-14 flex flex-col items-center text-center"
        style={{
          background: 'var(--background)',
          color: 'var(--foreground)',
        }}
      >
        <TornPaperEdge />
        <PointingHand />
        <AboutMe />
      </section>

      <CallMeBaby />

      <section id="work" className="relative z-10 min-h-screen bg-[var(--background)]">
        <Works works={works as any} categories={categories} />
      </section>

      <ConstructionBanner />

      <WhyWorkWithMe />
      <MoreAboutMeBanner />

      <Footer socialLinks={socialLinks} />

      {activeResume?.file_url && (
        <FloatingResume fileUrl={activeResume.file_url} name={activeResume.name} />
      )}

      <WhatsNewPopup activeItem={activeWhatsNew} />
    </main>
  );
}
