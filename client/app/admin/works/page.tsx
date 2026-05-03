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
            <img src={work.main_image} alt={work.title} className="w-12 h-12 rounded-lg object-cover border border-[var(--border)]" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)]">
              <Briefcase size={20} />
            </div>
          )}
          <div>
            <p className="font-medium text-[var(--foreground)]">{work.title}</p>
            {work.subtitle && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{work.subtitle}</p>}
          </div>
        </div>
      )
    },
    {
      header: 'Year',
      key: 'year',
      render: (work: Work) => <span className="text-sm text-[var(--muted-foreground)]">{work.year || '-'}</span>
    },
    {
      header: 'Live Link',
      key: 'live_link',
      render: (work: Work) => (
        work.live_link ? (
          <a href={work.live_link} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--accent)] hover:underline">
            View Site
          </a>
        ) : (
          <span className="text-sm text-[var(--muted-foreground)]/50">-</span>
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
            className="p-2 text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded-lg transition-colors"
            title="View"
          >
            <Eye size={16} />
          </Link>
          <Link
            href={`/admin/works/${work.id}`}
            className="p-2 text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded-lg transition-colors"
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
      <div className="px-8 pt-7 pb-5 border-b border-[var(--border)] flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Works</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">Manage your portfolio projects</p>
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
