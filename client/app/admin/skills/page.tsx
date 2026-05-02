import { getAllSkills } from '@/lib/admin/models/skills.model';
import SkillsManager from '@/components/admin/skills/SkillsManager';

export const metadata = { title: 'Skills — Admin' };

export default async function SkillsPage() {
  const skills = await getAllSkills();

  return (
    <div>
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5]">
        <h1 className="text-xl font-bold text-[#1a1a1a]">Skills & Expertise</h1>
        <p className="text-sm text-[#8b9aaa] mt-0.5">Manage your technical skills and proficiency levels</p>
      </div>

      <div className="p-8">
        <SkillsManager initialSkills={skills} />
      </div>
    </div>
  );
}
