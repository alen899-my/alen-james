import { getAllExperiences } from '@/lib/admin/models/experiences.model';
import { getAllSocialLinks } from '@/lib/admin/models/social_links.model';
import ExperiencesClient from './ExperiencesClient';
import Footer from '@/components/layout/Footer';

export const revalidate = 0;

export const metadata = {
    title: 'My Experiences | Alen James',
    description: 'A journey through my professional career — every role, every milestone, every lesson.'
};

export default async function ExperiencesPage() {
    const [experiences, socialLinks] = await Promise.all([
        getAllExperiences(),
        getAllSocialLinks(),
    ]);
    return (
        <main className="min-h-screen bg-[var(--background)]">
            <ExperiencesClient experiences={experiences} />
            <Footer socialLinks={socialLinks} />
        </main>
    );
}
