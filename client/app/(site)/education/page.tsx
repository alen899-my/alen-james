import { getAllEducation } from '@/lib/admin/models/education.model';
import { getAllSocialLinks } from '@/lib/admin/models/social_links.model';
import EducationClient from './EducationClient';
import Footer from '@/components/layout/Footer';
import CallMeBaby from '@/components/home/CallMeBaby';

// Cache page for 5 minutes (ISR)
export const revalidate = 300;

export const metadata = {
    title: 'Education | Alen James',
    description: 'My academic journey and educational background.'
};

export default async function EducationPage() {
    const [education, socialLinks] = await Promise.all([
        getAllEducation(),
        getAllSocialLinks(),
    ]);

    return (
        <main className="min-h-screen bg-[var(--background)] pt-24">
            <EducationClient education={education} />
            
            <div className="mt-32">
                <CallMeBaby />
            </div>
            
            <Footer socialLinks={socialLinks} />
        </main>
    );
}
