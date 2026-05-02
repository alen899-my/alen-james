import MediaForm from '@/components/admin/media/MediaForm';
import { getMediaGalleryById } from '@/lib/admin/models/media.model';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Edit Media — Admin' };

export default async function EditMediaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const media = await getMediaGalleryById(Number(resolvedParams.id));

  if (!media) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5] flex items-center gap-3">
        <Link
          href="/admin/media"
          className="p-1 -ml-1 rounded-lg text-[#8b9aaa] hover:bg-[#faf7f0] hover:text-[#1a1a1a] transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a]">Edit Media Gallery</h1>
          <p className="text-sm text-[#8b9aaa] mt-0.5">Update {media.title}</p>
        </div>
      </div>
      <div className="p-8">
        <MediaForm media={media} />
      </div>
    </div>
  );
}
