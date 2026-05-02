import { getAllWorks, Work } from '@/lib/admin/models/works.model';
import Link from 'next/link';
import { Briefcase, Plus, Pencil, Eye } from 'lucide-react';
import DeleteWorkButton from './delete-work-button';
import AdminTable from '@/components/admin/common/AdminTable';

export const metadata = { title: 'Works — Admin' };

export default async function WorksPage() {
  const works = await getAllWorks();

  const columns = [
    {
      header: 'Project',
      key: 'title',
      render: (work: Work) => (
        <div className="flex items-center gap-4">
          {work.main_image ? (
            <img src={work.main_image} alt={work.title} className="w-12 h-12 rounded-lg object-cover border border-[#e8e2d5]" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-[#faf7f0] border border-[#e8e2d5] flex items-center justify-center text-[#aab4be]">
              <Briefcase size={20} />
            </div>
          )}
          <div>
            <p className="font-medium text-[#1a1a1a]">{work.title}</p>
            {work.subtitle && <p className="text-xs text-[#8b9aaa] mt-0.5">{work.subtitle}</p>}
          </div>
        </div>
      )
    },
    {
      header: 'Year',
      key: 'year',
      render: (work: Work) => <span className="text-sm text-[#3d4852]">{work.year || '-'}</span>
    },
    {
      header: 'Live Link',
      key: 'live_link',
      render: (work: Work) => (
        work.live_link ? (
          <a href={work.live_link} target="_blank" rel="noopener noreferrer" className="text-sm text-[#1084a2] hover:underline">
            View Site
          </a>
        ) : (
          <span className="text-sm text-[#aab4be]">-</span>
        )
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (work: Work) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/works/${work.id}/view`}
            className="p-2 text-[#8b9aaa] hover:text-[#1084a2] hover:bg-[#1084a2]/10 rounded-lg transition-colors"
            title="View"
          >
            <Eye size={16} />
          </Link>
          <Link
            href={`/admin/works/${work.id}`}
            className="p-2 text-[#8b9aaa] hover:text-[#1084a2] hover:bg-[#1084a2]/10 rounded-lg transition-colors"
            title="Edit"
          >
            <Pencil size={16} />
          </Link>
          <DeleteWorkButton id={work.id} title={work.title} />
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5] flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a]">Works</h1>
          <p className="text-sm text-[#8b9aaa] mt-0.5">Manage your portfolio projects</p>
        </div>
        <Link
          href="/admin/works/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#1084a2] text-white rounded-xl text-sm font-medium hover:bg-[#1a9bbf] transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Work
        </Link>
      </div>

      <div className="p-8">
        <AdminTable 
          columns={columns} 
          data={works} 
          keyField="id" 
          emptyMessage="You haven't added any portfolio works yet."
          emptyIcon={<Briefcase size={40} />}
        />
      </div>
    </div>
  );
}
