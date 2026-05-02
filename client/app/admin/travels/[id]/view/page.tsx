import { getTravelById } from '@/lib/admin/models/travels.model';
import Link from 'next/link';
import { ArrowLeft, Pencil, Lock, Globe, ExternalLink, Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';

export const metadata = { title: 'View Travel Log — Admin' };

export default async function ViewTravelPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const travel = await getTravelById(Number(resolvedParams.id));

  if (!travel) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/travels"
            className="p-1 -ml-1 rounded-lg text-[#8b9aaa] hover:bg-[#faf7f0] hover:text-[#1a1a1a] transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#1a1a1a]">{travel.location}</h1>
            {travel.period && (
              <p className="text-sm text-[#8b9aaa] flex items-center gap-1.5 mt-1">
                <Calendar size={14} />
                {travel.period}
              </p>
            )}
          </div>
        </div>
        <Link
          href={`/admin/travels/${travel.id}`}
          className="flex items-center gap-2 px-4 py-2 bg-[#1084a2] text-white rounded-xl text-sm font-medium hover:bg-[#1a9bbf] transition-colors shadow-sm"
        >
          <Pencil size={16} />
          Edit Log
        </Link>
      </div>

      <div className="p-8 space-y-10">
        
        {/* Privacy Status Banner */}
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${travel.is_public ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-200'}`}>
          <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${travel.is_public ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
            {travel.is_public ? <Globe size={20} /> : <Lock size={20} />}
          </div>
          <div>
            <p className={`text-sm font-bold ${travel.is_public ? 'text-green-700' : 'text-gray-700'}`}>
              {travel.is_public ? 'Public Travel Log' : 'Private Travel Log'}
            </p>
            <p className={`text-xs mt-0.5 ${travel.is_public ? 'text-green-600' : 'text-gray-500'}`}>
              {travel.is_public 
                ? 'This log is visible to anyone visiting your public website.' 
                : 'This log is secret and only visible in the admin panel.'}
            </p>
          </div>
          {travel.password && (
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e8e2d5] rounded-lg shadow-sm">
              <Lock size={14} className="text-[#1084a2]" />
              <span className="text-xs font-semibold text-[#1a1a1a]">Password Protected</span>
            </div>
          )}
        </div>

        {/* Content */}
        {travel.description && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#aab4be] mb-3">The Journey</h2>
            <div className="bg-white p-6 rounded-2xl border border-[#e8e2d5] shadow-sm">
              <p className="text-[#3d4852] leading-relaxed whitespace-pre-wrap text-[15px]">
                {travel.description}
              </p>
            </div>
          </section>
        )}

        {/* Image Gallery */}
        {travel.images && travel.images.length > 0 && (
          <section className="pt-6 border-t border-[#e8e2d5]">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#aab4be] mb-4">Gallery ({travel.images.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {travel.images.map((url, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-[#e8e2d5] shadow-md group relative aspect-square">
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
        {travel.videos && travel.videos.length > 0 && (
          <section className="pt-6 border-t border-[#e8e2d5]">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#aab4be] mb-4">Videos ({travel.videos.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {travel.videos.map((url, i) => (
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
