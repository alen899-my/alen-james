import { getAllWhatsNew, WhatsNew } from '@/lib/admin/models/whats_new.model';
import Link from 'next/link';
import { Sparkles, Plus, Pencil, CheckCircle2, Megaphone } from 'lucide-react';
import DeleteWhatsNewButton from './delete-whats-new-button';
import AdminTable from '@/components/admin/common/AdminTable';

export const metadata = { title: "What's New — Admin" };

export default async function WhatsNewPage() {
  const items = await getAllWhatsNew();

  const columns = [
    {
      header: 'Announcement',
      key: 'title',
      render: (item: WhatsNew) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#faf7f0] border border-[#e8e2d5] flex items-center justify-center overflow-hidden shrink-0">
            {item.image_url ? (
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <Megaphone size={18} className="text-[#1084a2]" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#1a1a1a] truncate max-w-xs">{item.title}</p>
            <p className="text-xs text-[#8b9aaa] truncate max-w-xs mt-0.5">{item.content}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      key: 'is_active',
      render: (item: WhatsNew) => (
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
      header: 'Button Link',
      key: 'btn_url',
      render: (item: WhatsNew) => (
        item.btn_url ? (
          <span className="text-xs text-[#1084a2] truncate max-w-[120px] inline-block font-mono bg-[#1084a2]/5 px-2 py-0.5 rounded border border-[#1084a2]/10">
            {item.btn_text || 'Link'}: {item.btn_url}
          </span>
        ) : (
          <span className="text-xs text-[#8b9aaa]">None</span>
        )
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (item: WhatsNew) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/whats-new/${item.id}`}
            className="p-2 text-[#8b9aaa] hover:text-[#1084a2] hover:bg-[#1084a2]/10 rounded-lg transition-colors"
            title="Edit"
          >
            <Pencil size={16} />
          </Link>
          <DeleteWhatsNewButton id={item.id} title={item.title} />
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="px-4 sm:px-8 py-5 sm:py-7 border-b border-[#e8e2d5] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a]">What's New</h1>
          <p className="text-sm text-[#8b9aaa] mt-0.5">Manage opening popup cards and latest work plans</p>
        </div>
        <Link
          href="/admin/whats-new/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#1084a2] text-white rounded-xl text-sm font-medium hover:bg-[#1a9bbf] transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus size={16} />
          Add Announcement
        </Link>
      </div>

      <div className="p-4 sm:p-8 max-w-5xl">
        <AdminTable 
          columns={columns} 
          data={items} 
          keyField="id" 
          emptyMessage="You haven't created any announcements yet."
          emptyIcon={<Sparkles size={40} />}
        />
      </div>
    </div>
  );
}
