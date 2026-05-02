import { getAllDiaries, Diary } from '@/lib/admin/models/diaries.model';
import Link from 'next/link';
import { Notebook, Plus, Pencil, Eye, Lock, Globe } from 'lucide-react';
import DeleteDiaryButton from './delete-diary-button';
import AdminTable from '@/components/admin/common/AdminTable';

export const metadata = { title: 'My Diary — Admin' };

export default async function DiariesPage() {
  const diaries = await getAllDiaries();

  const columns = [
    {
      header: 'Entry Title',
      key: 'title',
      render: (diary: Diary) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#faf7f0] border border-[#e8e2d5] flex items-center justify-center text-[#aab4be]">
            <Notebook size={18} />
          </div>
          <div>
            <p className="font-medium text-[#1a1a1a]">{diary.title}</p>
            <p className="text-xs text-[#8b9aaa] mt-0.5">
              {diary.incident_date 
                ? new Date(diary.incident_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) 
                : 'No Date'}
            </p>
          </div>
        </div>
      )
    },
    {
      header: 'Visibility',
      key: 'is_public',
      render: (diary: Diary) => (
        <div className="flex items-center gap-1.5">
          {diary.is_public ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-600 text-xs font-semibold border border-green-100">
              <Globe size={12} /> Public
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 text-gray-500 text-xs font-semibold border border-gray-200">
              <Lock size={12} /> Private
            </span>
          )}
          {diary.password && (
            <span title="Password Protected" className="text-[#1084a2]">
              <Lock size={14} />
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Images',
      key: 'images',
      render: (diary: Diary) => <span className="text-sm text-[#3d4852]">{diary.images.length} Attached</span>
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (diary: Diary) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/diaries/${diary.id}/view`}
            className="p-2 text-[#8b9aaa] hover:text-[#1084a2] hover:bg-[#1084a2]/10 rounded-lg transition-colors"
            title="View"
          >
            <Eye size={16} />
          </Link>
          <Link
            href={`/admin/diaries/${diary.id}`}
            className="p-2 text-[#8b9aaa] hover:text-[#1084a2] hover:bg-[#1084a2]/10 rounded-lg transition-colors"
            title="Edit"
          >
            <Pencil size={16} />
          </Link>
          <DeleteDiaryButton id={diary.id} title={diary.title} />
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5] flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a]">My Diary</h1>
          <p className="text-sm text-[#8b9aaa] mt-0.5">Manage your personal stories and incidents</p>
        </div>
        <Link
          href="/admin/diaries/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#1084a2] text-white rounded-xl text-sm font-medium hover:bg-[#1a9bbf] transition-colors shadow-sm"
        >
          <Plus size={16} />
          Write Entry
        </Link>
      </div>

      <div className="p-8">
        <AdminTable 
          columns={columns} 
          data={diaries} 
          keyField="id" 
          emptyMessage="You haven't written any diary entries yet."
          emptyIcon={<Notebook size={40} />}
        />
      </div>
    </div>
  );
}
