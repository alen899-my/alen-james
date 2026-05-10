import { getAllEducation } from '@/lib/admin/models/education.model';
import { getAllSocialLinks } from '@/lib/admin/models/social_links.model';
import EducationClient from './EducationClient';
import Footer from '@/components/layout/Footer';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

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
        <main className="min-h-screen flex flex-col pt-24" style={{ background: 'var(--background)' }}>
            <EducationClient education={education} />
            <Footer socialLinks={socialLinks} />
        </main>
    );
}
