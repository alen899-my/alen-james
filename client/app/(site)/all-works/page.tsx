import { getAllWorks } from '@/lib/admin/models/works.model';
import { getAllWorkCategories } from '@/lib/admin/models/work_categories.model';
import { getAllSocialLinks } from '@/lib/admin/models/social_links.model';
import WorksList from '@/components/work/WorksList';
import Footer from '@/components/layout/Footer';
import CallMeBaby from '@/components/home/CallMeBaby';

export const revalidate = 300; // Cache page for 5 minutes (ISR)

export const metadata = {
    title: 'Full Works | Alen James',
    description: 'Explore the complete collection of design and development Works by Alen James.'
};

export default async function WorksPage() {
    const [works, categories, socialLinks] = await Promise.all([
        getAllWorks(),
        getAllWorkCategories(),
        getAllSocialLinks()
    ]);

    return (
        <main className="min-h-screen bg-[var(--background)] pt-24">
            <WorksList initialWorks={works} categories={categories} />
            
            <div className="mt-32">
                <CallMeBaby />
            </div>
            
            <Footer socialLinks={socialLinks} />
        </main>
    );
}
