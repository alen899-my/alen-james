import { getAdminSession } from '@/lib/auth';
import { getAllAdmins } from '@/lib/admin/models/admin.model';
import { getSettings } from '@/lib/admin/models/settings.model';
import { getAllWorks } from '@/lib/admin/models/works.model';
import { getAllExperiences } from '@/lib/admin/models/experiences.model';
import { getAllSkills } from '@/lib/admin/models/skills.model';
import { getAllBlogs } from '@/lib/admin/models/blogs.model';
import DashboardAnalytics from '@/components/admin/dashboard/DashboardAnalytics';

export const metadata = { title: 'Admin Dashboard — Alen James' };

export default async function AdminDashboard() {
  const [
    session, 
    admins, 
    settings,
    works,
    experiences,
    skills,
    blogs
  ] = await Promise.all([
    getAdminSession(),
    getAllAdmins(),
    getSettings(),
    getAllWorks(),
    getAllExperiences(),
    getAllSkills(),
    getAllBlogs()
  ]);

  const dbStats = {
    works: works.length,
    experiences: experiences.length,
    skills: skills.length,
    blogs: blogs.length
  };

  return (
    <div className="flex flex-col gap-6 p-8 bg-[#faf7f0] min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-1 pb-2">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">
          Welcome back, {session?.name?.split(' ')[0] || 'Admin'} 👋
        </h1>
        <p className="text-sm text-[#8b9aaa]">
          Here is what's happening with your portfolio today.
        </p>
      </div>

      {/* Analytics Dashboard */}
      <DashboardAnalytics dbStats={dbStats} />
    </div>
  );
}
