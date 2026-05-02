import { getAllExperiences, Experience } from '@/lib/admin/models/experiences.model';
import Link from 'next/link';
import { Building, Plus, Pencil, Eye, Calendar } from 'lucide-react';
import DeleteExperienceButton from './delete-experience-button';
import AdminTable from '@/components/admin/common/AdminTable';

export const metadata = { title: 'Experiences — Admin' };

export default async function ExperiencesPage() {
  const experiences = await getAllExperiences();

  const columns = [
    {
      header: 'Role / Company',
      key: 'job_title',
      render: (exp: Experience) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#faf7f0] border border-[#e8e2d5] flex items-center justify-center text-[#aab4be]">
            {exp.images && exp.images.length > 0 ? (
              <img src={exp.images[0]} alt={exp.job_title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Building size={20} />
            )}
          </div>
          <div>
            <p className="font-medium text-[#1a1a1a]">{exp.job_title}</p>
            {exp.location && (
              <p className="text-xs text-[#8b9aaa] mt-0.5">{exp.location}</p>
            )}
          </div>
        </div>
      )
    },
    {
      header: 'Timeline',
      key: 'timeline',
      render: (exp: Experience) => (
        <div className="flex items-center gap-1.5 text-sm text-[#3d4852]">
          <Calendar size={14} className="text-[#aab4be]" />
          <span>{exp.from_date || 'N/A'}</span>
          <span className="text-[#aab4be] px-1">-</span>
          <span>{exp.to_date || 'Present'}</span>
        </div>
      )
    },
    {
      header: 'Media',
      key: 'media',
      render: (exp: Experience) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm text-[#3d4852]">{exp.images.length} Images</span>
          <span className="text-xs text-[#8b9aaa]">{exp.videos.length} Videos</span>
        </div>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (exp: Experience) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/experiences/${exp.id}/view`}
            className="p-2 text-[#8b9aaa] hover:text-[#1084a2] hover:bg-[#1084a2]/10 rounded-lg transition-colors"
            title="View"
          >
            <Eye size={16} />
          </Link>
          <Link
            href={`/admin/experiences/${exp.id}`}
            className="p-2 text-[#8b9aaa] hover:text-[#1084a2] hover:bg-[#1084a2]/10 rounded-lg transition-colors"
            title="Edit"
          >
            <Pencil size={16} />
          </Link>
          <DeleteExperienceButton id={exp.id} job_title={exp.job_title} />
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5] flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a]">Experiences</h1>
          <p className="text-sm text-[#8b9aaa] mt-0.5">Manage your work and volunteer history</p>
        </div>
        <Link
          href="/admin/experiences/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#1084a2] text-white rounded-xl text-sm font-medium hover:bg-[#1a9bbf] transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Experience
        </Link>
      </div>

      <div className="p-8">
        <AdminTable 
          columns={columns} 
          data={experiences} 
          keyField="id" 
          emptyMessage="You haven't added any experiences yet."
          emptyIcon={<Building size={40} />}
        />
      </div>
    </div>
  );
}
