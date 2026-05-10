import { getAllSkills } from '@/lib/admin/models/skills.model';
import { getAllSocialLinks } from '@/lib/admin/models/social_links.model';
import SkillsClient from './SkillsClient';

import Footer from '@/components/layout/Footer';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'My Skills | Alen James',
    description: 'A deep dive into my technical toolkit and expertise.'
};

export default async function SkillsPage() {
    const [skills, socialLinks] = await Promise.all([
        getAllSkills(),
        getAllSocialLinks(),
    ]);

    return (
        <main className="min-h-screen flex flex-col pt-24" style={{ background: 'var(--background)' }}>
            <SkillsClient skills={skills} />
            <Footer socialLinks={socialLinks} />
        </main>
    );
}
