import { getPersonById } from '@/lib/admin/models/people.model';
import Link from 'next/link';
import { ArrowLeft, Pencil, Lock, Globe, ExternalLink } from 'lucide-react';
import { notFound } from 'next/navigation';

export const metadata = { title: 'View Person — Admin' };

export default async function ViewPersonPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const person = await getPersonById(Number(resolvedParams.id));

  if (!person) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/people"
            className="p-1 -ml-1 rounded-lg text-[#8b9aaa] hover:bg-[#faf7f0] hover:text-[#1a1a1a] transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#1a1a1a]">{person.name}</h1>
            <p className="text-sm text-[#8b9aaa] mt-0.5">
              {person.relation || 'No relation specified'}
            </p>
          </div>
        </div>
        <Link
          href={`/admin/people/${person.id}`}
          className="flex items-center gap-2 px-4 py-2 bg-[#1084a2] text-white rounded-xl text-sm font-medium hover:bg-[#1a9bbf] transition-colors shadow-sm"
        >
          <Pencil size={16} />
          Edit Profile
        </Link>
      </div>

      <div className="p-8 space-y-10">
        
        {/* Privacy Status Banner */}
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${person.is_public ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-200'}`}>
          <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${person.is_public ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
            {person.is_public ? <Globe size={20} /> : <Lock size={20} />}
          </div>
          <div>
            <p className={`text-sm font-bold ${person.is_public ? 'text-green-700' : 'text-gray-700'}`}>
              {person.is_public ? 'Public Profile' : 'Private Profile'}
            </p>
            <p className={`text-xs mt-0.5 ${person.is_public ? 'text-green-600' : 'text-gray-500'}`}>
              {person.is_public 
                ? 'This profile is visible to anyone visiting your public website.' 
                : 'This profile is secret and only visible in the admin panel.'}
            </p>
          </div>
          {person.password && (
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e8e2d5] rounded-lg shadow-sm">
              <Lock size={14} className="text-[#1084a2]" />
              <span className="text-xs font-semibold text-[#1a1a1a]">Password Protected</span>
            </div>
          )}
        </div>

        {/* Content */}
        {person.about_them && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#aab4be] mb-3">About {person.name}</h2>
            <div className="bg-white p-6 rounded-2xl border border-[#e8e2d5] shadow-sm">
              <p className="text-[#3d4852] leading-relaxed whitespace-pre-wrap text-[15px]">
                {person.about_them}
              </p>
            </div>
          </section>
        )}

        {/* Image Gallery */}
        {person.images && person.images.length > 0 && (
          <section className="pt-6 border-t border-[#e8e2d5]">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#aab4be] mb-4">Gallery ({person.images.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {person.images.map((url, i) => (
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
        {person.videos && person.videos.length > 0 && (
          <section className="pt-6 border-t border-[#e8e2d5]">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#aab4be] mb-4">Videos ({person.videos.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {person.videos.map((url, i) => (
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
