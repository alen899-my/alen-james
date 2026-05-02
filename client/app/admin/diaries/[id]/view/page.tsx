import { getDiaryById } from '@/lib/admin/models/diaries.model';
import Link from 'next/link';
import { ArrowLeft, Pencil, Lock, Globe, Calendar, ExternalLink } from 'lucide-react';
import { notFound } from 'next/navigation';

export const metadata = { title: 'View Diary Entry — Admin' };

export default async function ViewDiaryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const diary = await getDiaryById(Number(resolvedParams.id));

  if (!diary) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/diaries"
            className="p-1 -ml-1 rounded-lg text-[#8b9aaa] hover:bg-[#faf7f0] hover:text-[#1a1a1a] transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#1a1a1a]">{diary.title}</h1>
            <p className="text-sm text-[#8b9aaa] mt-0.5 flex items-center gap-1.5">
              <Calendar size={14} />
              {diary.incident_date 
                ? new Date(diary.incident_date).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                : 'No Date'}
            </p>
          </div>
        </div>
        <Link
          href={`/admin/diaries/${diary.id}`}
          className="flex items-center gap-2 px-4 py-2 bg-[#1084a2] text-white rounded-xl text-sm font-medium hover:bg-[#1a9bbf] transition-colors shadow-sm"
        >
          <Pencil size={16} />
          Edit Entry
        </Link>
      </div>

      <div className="p-8 space-y-10">
        
        {/* Privacy Status Banner */}
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${diary.is_public ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-200'}`}>
          <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${diary.is_public ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
            {diary.is_public ? <Globe size={20} /> : <Lock size={20} />}
          </div>
          <div>
            <p className={`text-sm font-bold ${diary.is_public ? 'text-green-700' : 'text-gray-700'}`}>
              {diary.is_public ? 'Public Entry' : 'Private Entry'}
            </p>
            <p className={`text-xs mt-0.5 ${diary.is_public ? 'text-green-600' : 'text-gray-500'}`}>
              {diary.is_public 
                ? 'This entry is visible to anyone visiting your public website.' 
                : 'This entry is secret and only visible in the admin panel.'}
            </p>
          </div>
          {diary.password && (
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e8e2d5] rounded-lg shadow-sm">
              <Lock size={14} className="text-[#1084a2]" />
              <span className="text-xs font-semibold text-[#1a1a1a]">Password Protected</span>
            </div>
          )}
        </div>

        {/* Story Content */}
        {diary.content && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#aab4be] mb-3">The Story</h2>
            <div className="bg-white p-6 rounded-2xl border border-[#e8e2d5] shadow-sm">
              <p className="text-[#3d4852] leading-relaxed whitespace-pre-wrap font-serif text-[15px]">
                {diary.content}
              </p>
            </div>
          </section>
        )}

        {/* Image Gallery */}
        {diary.images && diary.images.length > 0 && (
          <section className="pt-6 border-t border-[#e8e2d5]">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#aab4be] mb-4">Attached Memories ({diary.images.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {diary.images.map((url, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-[#e8e2d5] shadow-md group relative aspect-square">
                  <img src={url} alt={`Memory ${i + 1}`} className="w-full h-full object-cover" />
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
      </div>
    </div>
  );
}
