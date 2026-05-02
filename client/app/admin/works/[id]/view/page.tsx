import { getWorkById } from '@/lib/admin/models/works.model';
import Link from 'next/link';
import { ArrowLeft, Pencil, Globe, ExternalLink } from 'lucide-react';
import { notFound } from 'next/navigation';

export const metadata = { title: 'View Work — Admin' };

export default async function ViewWorkPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const work = await getWorkById(Number(resolvedParams.id));

  if (!work) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/works"
            className="p-1 -ml-1 rounded-lg text-[#8b9aaa] hover:bg-[#faf7f0] hover:text-[#1a1a1a] transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#1a1a1a]">{work.title}</h1>
            <p className="text-sm text-[#8b9aaa] mt-0.5">{work.year || 'No year specified'}</p>
          </div>
        </div>
        <Link
          href={`/admin/works/${work.id}`}
          className="flex items-center gap-2 px-4 py-2 bg-[#1084a2] text-white rounded-xl text-sm font-medium hover:bg-[#1a9bbf] transition-colors shadow-sm"
        >
          <Pencil size={16} />
          Edit Work
        </Link>
      </div>

      <div className="p-8 space-y-10">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* Introduction */}
            {work.introduction && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#aab4be] mb-3">Introduction</h2>
                <p className="text-[#3d4852] leading-relaxed whitespace-pre-wrap bg-white p-6 rounded-2xl border border-[#e8e2d5]">
                  {work.introduction}
                </p>
              </section>
            )}

            {/* Description */}
            {work.description && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#aab4be] mb-3">Short Description</h2>
                <p className="text-[#3d4852] leading-relaxed whitespace-pre-wrap bg-white p-6 rounded-2xl border border-[#e8e2d5]">
                  {work.description}
                </p>
              </section>
            )}

            {/* What I Did */}
            {work.what_i_did && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#aab4be] mb-3">What did I do?</h2>
                <p className="text-[#3d4852] leading-relaxed whitespace-pre-wrap bg-white p-6 rounded-2xl border border-[#e8e2d5]">
                  {work.what_i_did}
                </p>
              </section>
            )}
          </div>

          <div className="space-y-8">
            {/* Project Info Card */}
            <div className="bg-[#faf7f0] rounded-2xl border border-[#e8e2d5] p-6 space-y-6">
              <div>
                <h3 className="text-xs font-bold text-[#aab4be] uppercase tracking-widest mb-1">Subtitle</h3>
                <p className="text-sm font-medium text-[#1a1a1a]">{work.subtitle || '-'}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-[#aab4be] uppercase tracking-widest mb-1">Live Site</h3>
                {work.live_link ? (
                  <a href={work.live_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-[#1084a2] hover:underline">
                    <Globe size={14} />
                    {new URL(work.live_link).hostname}
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <p className="text-sm text-[#8b9aaa]">No link provided</p>
                )}
              </div>

              <div>
                <h3 className="text-xs font-bold text-[#aab4be] uppercase tracking-widest mb-3">Tech Stacks</h3>
                <div className="flex flex-wrap gap-2">
                  {work.tech_stacks && work.tech_stacks.length > 0 ? (
                    work.tech_stacks.map(tech => (
                      <span key={tech} className="px-2.5 py-1 bg-white text-[#1084a2] rounded-lg text-xs font-medium border border-[#1084a2]/10 shadow-sm">
                        {tech}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-[#8b9aaa]">None specified</p>
                  )}
                </div>
              </div>
            </div>

            {/* Main Image Preview */}
            {work.main_image && (
              <section>
                <h2 className="text-xs font-bold text-[#aab4be] uppercase tracking-widest mb-3">Main Card Image</h2>
                <div className="rounded-2xl overflow-hidden border border-[#e8e2d5] shadow-sm">
                  <img src={work.main_image} alt={work.title} className="w-full h-auto" />
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Media Assets Section */}
        <div className="space-y-10 pt-10 border-t border-[#e8e2d5]">
          {/* Main Video */}
          {work.video_url && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#aab4be] mb-4">Project Video</h2>
              <div className="max-w-4xl rounded-2xl overflow-hidden border border-[#e8e2d5] bg-black shadow-lg aspect-video">
                <video src={work.video_url} controls className="w-full h-full" />
              </div>
            </section>
          )}

          {/* Additional Videos */}
          {work.additional_videos && work.additional_videos.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#aab4be] mb-4">Additional Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {work.additional_videos.map((url, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-[#e8e2d5] bg-black shadow-md aspect-video">
                    <video src={url} controls className="w-full h-full" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Screenshots */}
          {work.screenshots && work.screenshots.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#aab4be] mb-4">Screenshots Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {work.screenshots.map((url, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-[#e8e2d5] shadow-md group relative">
                    <img src={url} alt={`Screenshot ${i + 1}`} className="w-full h-auto" />
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
    </div>
  );
}
