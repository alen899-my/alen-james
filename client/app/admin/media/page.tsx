import { getAllMediaGallery, MediaGallery } from '@/lib/admin/models/media.model';
import Link from 'next/link';
import { Image as ImageIcon, Plus, Pencil, Eye, Calendar, Film } from 'lucide-react';
import DeleteMediaButton from './delete-media-button';
import AdminTable from '@/components/admin/common/AdminTable';

export const metadata = { title: 'Media Gallery — Admin' };

export default async function MediaPage() {
  const mediaItems = await getAllMediaGallery();

  const columns = [
    {
      header: 'Media Name',
      key: 'title',
      render: (item: MediaGallery) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#faf7f0] border border-[#e8e2d5] flex items-center justify-center text-[#aab4be] overflow-hidden">
            {item.images && item.images.length > 0 ? (
              <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={20} />
            )}
          </div>
          <div>
            <p className="font-medium text-[#1a1a1a]">{item.title}</p>
            {item.media_date && (
              <p className="text-xs text-[#8b9aaa] mt-0.5">{item.media_date}</p>
            )}
          </div>
        </div>
      )
    },
    {
      header: 'Content',
      key: 'content',
      render: (item: MediaGallery) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-sm text-[#3d4852]">
            <ImageIcon size={14} className="text-[#aab4be]" />
            <span>{item.images.length}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-[#3d4852]">
            <Film size={14} className="text-[#aab4be]" />
            <span>{item.videos.length}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Created At',
      key: 'created_at',
      render: (item: MediaGallery) => (
        <span className="text-sm text-[#8b9aaa]">
          {new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (item: MediaGallery) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/media/${item.id}/view`}
            className="p-2 text-[#8b9aaa] hover:text-[#1084a2] hover:bg-[#1084a2]/10 rounded-lg transition-colors"
            title="View"
          >
            <Eye size={16} />
          </Link>
          <Link
            href={`/admin/media/${item.id}`}
            className="p-2 text-[#8b9aaa] hover:text-[#1084a2] hover:bg-[#1084a2]/10 rounded-lg transition-colors"
            title="Edit"
          >
            <Pencil size={16} />
          </Link>
          <DeleteMediaButton id={item.id} title={item.title} />
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="px-4 sm:px-8 py-5 sm:py-7 border-b border-[#e8e2d5] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a]">Media Gallery</h1>
          <p className="text-sm text-[#8b9aaa] mt-0.5">Manage your photo and video collections</p>
        </div>
        <Link
          href="/admin/media/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#1084a2] text-white rounded-xl text-sm font-medium hover:bg-[#1a9bbf] transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus size={16} />
          Add Gallery
        </Link>
      </div>

      <div className="p-4 sm:p-8">
        <AdminTable 
          columns={columns} 
          data={mediaItems} 
          keyField="id" 
          emptyMessage="You haven't added any media galleries yet."
          emptyIcon={<ImageIcon size={40} />}
        />
      </div>
    </div>
  );
}
