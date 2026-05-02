import { getAllSocialLinks } from '@/lib/admin/models/social_links.model';
import SocialsManager from '@/components/admin/socials/SocialsManager';

export const metadata = { title: 'Social Media — Admin' };

export default async function SocialsPage() {
  const socials = await getAllSocialLinks();

  return (
    <div>
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5]">
        <h1 className="text-xl font-bold text-[#1a1a1a]">Social Media Links</h1>
        <p className="text-sm text-[#8b9aaa] mt-0.5">Manage your online presence across different platforms</p>
      </div>

      <div className="p-8">
        <SocialsManager initialSocials={socials} />
      </div>
    </div>
  );
}
