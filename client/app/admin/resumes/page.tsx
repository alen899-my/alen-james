import { getAllResumes, Resume } from '@/lib/admin/models/resumes.model';
import Link from 'next/link';
import { ScrollText, Plus, Pencil, Eye, FileText, CheckCircle2 } from 'lucide-react';
import DeleteResumeButton from './delete-resume-button';
import AdminTable from '@/components/admin/common/AdminTable';

export const metadata = { title: 'Resumes — Admin' };

export default async function ResumesPage() {
  const resumes = await getAllResumes();

  const columns = [
    {
      header: 'Resume Name',
      key: 'name',
      render: (item: Resume) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#faf7f0] border border-[#e8e2d5] flex items-center justify-center text-red-500">
            <FileText size={18} />
          </div>
          <div>
            <p className="font-medium text-[#1a1a1a]">{item.name}</p>
            <p className="text-xs text-[#8b9aaa] mt-0.5">
              Uploaded {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      key: 'is_active',
      render: (item: Resume) => (
        item.is_active ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold border border-green-100">
            <CheckCircle2 size={12} /> Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 text-gray-400 text-xs font-medium border border-gray-200">
            Inactive
          </span>
        )
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (item: Resume) => (
        <div className="flex items-center justify-end gap-2">
          <a
            href={item.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[#8b9aaa] hover:text-[#1084a2] hover:bg-[#1084a2]/10 rounded-lg transition-colors"
            title="View PDF"
          >
            <Eye size={16} />
          </a>
          <Link
            href={`/admin/resumes/${item.id}`}
            className="p-2 text-[#8b9aaa] hover:text-[#1084a2] hover:bg-[#1084a2]/10 rounded-lg transition-colors"
            title="Edit"
          >
            <Pencil size={16} />
          </Link>
          <DeleteResumeButton id={item.id} name={item.name} />
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="px-4 sm:px-8 py-5 sm:py-7 border-b border-[#e8e2d5] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a]">Resumes</h1>
          <p className="text-sm text-[#8b9aaa] mt-0.5">Manage your professional CVs and documents</p>
        </div>
        <Link
          href="/admin/resumes/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#1084a2] text-white rounded-xl text-sm font-medium hover:bg-[#1a9bbf] transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus size={16} />
          Add Resume
        </Link>
      </div>

      <div className="p-4 sm:p-8 max-w-5xl">
        <AdminTable 
          columns={columns} 
          data={resumes} 
          keyField="id" 
          emptyMessage="You haven't uploaded any resumes yet."
          emptyIcon={<ScrollText size={40} />}
        />
      </div>
    </div>
  );
}
