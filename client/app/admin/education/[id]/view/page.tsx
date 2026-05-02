import { getEducationById } from '@/lib/admin/models/education.model';
import Link from 'next/link';
import { ArrowLeft, Pencil, MapPin, ExternalLink } from 'lucide-react';
import { notFound } from 'next/navigation';

export const metadata = { title: 'View Education — Admin' };

export default async function ViewEducationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const education = await getEducationById(Number(resolvedParams.id));

  if (!education) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/education"
            className="p-1 -ml-1 rounded-lg text-[#8b9aaa] hover:bg-[#faf7f0] hover:text-[#1a1a1a] transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#1a1a1a]">{education.name}</h1>
            <p className="text-sm text-[#8b9aaa] mt-0.5">
              {education.year_from} {education.year_to ? `- ${education.year_to}` : ''}
            </p>
          </div>
        </div>
        <Link
          href={`/admin/education/${education.id}`}
          className="flex items-center gap-2 px-4 py-2 bg-[#1084a2] text-white rounded-xl text-sm font-medium hover:bg-[#1a9bbf] transition-colors shadow-sm"
        >
          <Pencil size={16} />
          Edit Education
        </Link>
      </div>

      <div className="p-8 space-y-10">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            {education.about_education && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#aab4be] mb-3">About Education</h2>
                <p className="text-[#3d4852] leading-relaxed whitespace-pre-wrap bg-white p-6 rounded-2xl border border-[#e8e2d5]">
                  {education.about_education}
                </p>
              </section>
            )}

            {/* Achievements */}
            {education.achievements && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#aab4be] mb-3">Achievements</h2>
                <p className="text-[#3d4852] leading-relaxed whitespace-pre-wrap bg-white p-6 rounded-2xl border border-[#e8e2d5]">
                  {education.achievements}
                </p>
              </section>
            )}
          </div>

          <div className="space-y-8">
            {/* Project Info Card */}
            <div className="bg-[#faf7f0] rounded-2xl border border-[#e8e2d5] p-6 space-y-6">
              <div>
                <h3 className="text-xs font-bold text-[#aab4be] uppercase tracking-widest mb-1">Studied</h3>
                <p className="text-sm font-medium text-[#1a1a1a]">{education.studied || '-'}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-[#aab4be] uppercase tracking-widest mb-1">Location</h3>
                {education.school_location ? (
                  <span className="flex items-center gap-1.5 text-sm font-medium text-[#1a1a1a]">
                    <MapPin size={14} className="text-[#1084a2]" />
                    {education.school_location}
                  </span>
                ) : (
                  <p className="text-sm text-[#8b9aaa]">Not specified</p>
                )}
              </div>

              <div>
                <h3 className="text-xs font-bold text-[#aab4be] uppercase tracking-widest mb-1">Grade / Mark</h3>
                <p className="text-sm font-medium text-[#1a1a1a]">{education.grade_mark || '-'}</p>
              </div>
            </div>

            {/* Main Image Preview */}
            {education.school_photo && (
              <section>
                <h2 className="text-xs font-bold text-[#aab4be] uppercase tracking-widest mb-3">School Photo</h2>
                <div className="rounded-2xl overflow-hidden border border-[#e8e2d5] shadow-sm">
                  <img src={education.school_photo} alt={education.name} className="w-full h-auto" />
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Media Assets Section */}
        <div className="space-y-10 pt-10 border-t border-[#e8e2d5]">
          {/* Gallery */}
          {education.gallery && education.gallery.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#aab4be] mb-4">Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {education.gallery.map((url, i) => (
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
          {education.videos && education.videos.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#aab4be] mb-4">Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {education.videos.map((url, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-[#e8e2d5] bg-black shadow-md aspect-video">
                    <video src={url} controls className="w-full h-full" />
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
