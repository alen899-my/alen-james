import { getMediaGalleryById } from '@/lib/admin/models/media.model';
import Link from 'next/link';
import { ArrowLeft, Pencil, Calendar, ExternalLink, Image as ImageIcon, Info } from 'lucide-react';
import { notFound } from 'next/navigation';

export const metadata = { title: 'View Media Gallery — Admin' };

export default async function ViewMediaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const media = await getMediaGalleryById(Number(resolvedParams.id));

  if (!media) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/media"
            className="p-1 -ml-1 rounded-lg text-[#8b9aaa] hover:bg-[#faf7f0] hover:text-[#1a1a1a] transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#1a1a1a]">{media.title}</h1>
            {media.media_date && (
              <p className="text-sm text-[#8b9aaa] flex items-center gap-1.5 mt-1">
                <Calendar size={14} />
                {media.media_date}
              </p>
            )}
          </div>
        </div>
        <Link
          href={`/admin/media/${media.id}`}
          className="flex items-center gap-2 px-4 py-2 bg-[#1084a2] text-white rounded-xl text-sm font-medium hover:bg-[#1a9bbf] transition-colors shadow-sm"
        >
          <Pencil size={16} />
          Edit Gallery
        </Link>
      </div>

      <div className="p-8 space-y-10">
        
        {/* Info Banner */}
        {media.description && (
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#faf7f0] border border-[#e8e2d5]">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#e8e2d5] text-[#1084a2] flex-shrink-0 shadow-sm">
              <Info size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1a1a1a] mb-1">About this Media</h3>
              <p className="text-sm text-[#3d4852] leading-relaxed whitespace-pre-wrap">
                {media.description}
              </p>
            </div>
          </div>
        )}

        {/* Image Gallery */}
        {media.images && media.images.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <ImageIcon size={18} className="text-[#1084a2]" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#aab4be]">Images ({media.images.length})</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {media.images.map((url, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-[#e8e2d5] shadow-md group relative aspect-square bg-[#fdfbf7]">
                  <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <ExternalLink size={24} />
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Videos */}
        {media.videos && media.videos.length > 0 && (
          <section className="pt-6 border-t border-[#e8e2d5]">
            <div className="flex items-center gap-3 mb-4">
              <ImageIcon size={18} className="text-[#1084a2]" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#aab4be]">Videos ({media.videos.length})</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {media.videos.map((url, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-[#e8e2d5] bg-black shadow-md aspect-video">
                  <video src={url} controls className="w-full h-full" />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
