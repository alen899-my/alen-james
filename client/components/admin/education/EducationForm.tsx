'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createEducationAction, updateEducationAction } from '@/lib/admin/actions/education.actions';
import { Education } from '@/lib/admin/models/education.model';
import {
  Upload, X, Plus, Image as ImageIcon, Film,
  Loader2, Layers, FileText, Paperclip, ChevronRight,
  MapPin, GraduationCap
} from 'lucide-react';

interface EducationFormProps {
  education?: Education;
}

/* ── tiny reusable primitives ─────────────────────────────────── */

function SectionCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-sm overflow-hidden">
      {/* card header */}
      <div
        className="flex items-center gap-3 px-6 py-4 border-b border-[#f0ebe0]"
        style={{ background: 'linear-gradient(to bottom, #fdf9f2, #f7f2e8)' }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #1084a2, #1a9bbf)' }}
        >
          <span className="text-white">{icon}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1a1a1a] leading-none">{title}</p>
          {subtitle && <p className="text-xs text-[#8b9aaa] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {/* card body */}
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-[#8b9aaa]">
        {label}
        {required && <span className="ml-1 text-[#1084a2]">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full px-4 py-2.5 bg-[#fdfbf7] border border-[#e8e2d5] rounded-xl text-sm text-[#1a1a1a] placeholder:text-[#c4bdb0] focus:outline-none focus:border-[#1084a2] focus:ring-2 focus:ring-[#1084a2]/15 transition-all duration-150';

/* ── main component ───────────────────────────────────────────── */

export default function EducationForm({ education }: EducationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [gallery, setGallery] = useState<string[]>(education?.gallery || []);
  const [videos, setVideos] = useState<string[]>(education?.videos || []);
  const [schoolPhoto, setSchoolPhoto] = useState<string>(education?.school_photo || '');
  const [uploadingMedia, setUploadingMedia] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<
    'school_photo' | 'gallery' | 'video' | null
  >(null);

  /* handlers */
  const triggerUpload = (target: 'school_photo' | 'gallery' | 'video') => {
    setUploadTarget(target);
    if (fileInputRef.current) {
      fileInputRef.current.accept =
        target === 'video' ? 'video/*' : 'image/*';
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget) return;
    setUploadingMedia(uploadTarget);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        if (uploadTarget === 'school_photo') setSchoolPhoto(data.url);
        else if (uploadTarget === 'gallery') setGallery(p => [...p, data.url]);
        else if (uploadTarget === 'video') setVideos(p => [...p, data.url]);
      } else alert(data.error || 'Upload failed');
    } catch {
      alert('Upload failed');
    } finally {
      setUploadingMedia(null);
      setUploadTarget(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set('gallery', JSON.stringify(gallery));
    formData.set('videos', JSON.stringify(videos));
    formData.set('school_photo', schoolPhoto);
    const res = education
      ? await updateEducationAction(education.id, formData)
      : await createEducationAction(null, formData);
    setIsSubmitting(false);
    if (res.success) { router.push('/admin/education'); router.refresh(); }
    else setError(res.error || 'Something went wrong.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl">

      {/* hidden file input */}
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

      {/* error banner */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600">
          <X size={16} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* ── 1. Basic Details ─────────────────────────────────── */}
      <SectionCard
        icon={<GraduationCap size={15} />}
        title="Institution Details"
        subtitle="Core education information"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Institution Name" required>
            <input
              type="text"
              name="name"
              defaultValue={education?.name || ''}
              required
              placeholder="e.g. Oxford University"
              className={inputCls}
            />
          </Field>

          <Field label="Studied (Degree/Course)">
            <input
              type="text"
              name="studied"
              defaultValue={education?.studied || ''}
              placeholder="e.g. BSc Computer Science"
              className={inputCls}
            />
          </Field>

          <Field label="From Year">
            <input
              type="text"
              name="year_from"
              defaultValue={education?.year_from || ''}
              placeholder="e.g. 2018"
              className={inputCls}
            />
          </Field>

          <Field label="To Year">
            <input
              type="text"
              name="year_to"
              defaultValue={education?.year_to || ''}
              placeholder="e.g. 2022 or Present"
              className={inputCls}
            />
          </Field>

          <Field label="Location">
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aab4be]" />
              <input
                type="text"
                name="school_location"
                defaultValue={education?.school_location || ''}
                placeholder="e.g. Oxford, UK"
                className={`${inputCls} pl-10`}
              />
            </div>
          </Field>

          <Field label="Grade / Marks">
            <input
              type="text"
              name="grade_mark"
              defaultValue={education?.grade_mark || ''}
              placeholder="e.g. First Class Honors, 3.8 GPA"
              className={inputCls}
            />
          </Field>
        </div>
      </SectionCard>

      {/* ── 2. Content ───────────────────────────────────────── */}
      <SectionCard
        icon={<FileText size={15} />}
        title="Content"
        subtitle="Descriptions and write-up"
      >
        <div className="space-y-4">
          <Field label="About Education">
            <textarea
              name="about_education"
              defaultValue={education?.about_education || ''}
              rows={4}
              placeholder="Describe your experience, what you learned, key subjects..."
              className={`${inputCls} resize-y`}
            />
          </Field>

          <Field label="Key Achievements">
            <textarea
              name="achievements"
              defaultValue={education?.achievements || ''}
              rows={4}
              placeholder="Awards, scholarships, notable projects..."
              className={`${inputCls} resize-y`}
            />
          </Field>
        </div>
      </SectionCard>

      {/* ── 3. Media ─────────────────────────────────────────── */}
      <SectionCard
        icon={<Paperclip size={15} />}
        title="Media & Gallery"
        subtitle="Photos and videos from your time there"
      >
        <div className="space-y-6">

          {/* School Photo */}
          <div className="space-y-1.5 max-w-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8b9aaa]">
              Institution Logo / Main Photo
            </p>
            {schoolPhoto ? (
              <div className="relative group rounded-xl overflow-hidden border border-[#e8e2d5] aspect-video">
                <img src={schoolPhoto} alt="School" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => triggerUpload('school_photo')}
                    className="p-2 bg-white rounded-lg text-[#1a1a1a] hover:text-[#1084a2] shadow"
                  >
                    <Upload size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSchoolPhoto('')}
                    className="p-2 bg-white rounded-lg text-red-500 shadow"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            ) : (
              <UploadZone
                label="Upload School Photo"
                icon={<ImageIcon size={22} />}
                loading={uploadingMedia === 'school_photo'}
                onClick={() => triggerUpload('school_photo')}
              />
            )}
          </div>

          {/* Gallery grid */}
          <div className="space-y-2 pt-4 border-t border-[#f0ebe0]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8b9aaa]">
              Education Gallery (up to 20 images)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {gallery.map((url, i) => (
                <div
                  key={i}
                  className="relative group rounded-xl overflow-hidden border border-[#e8e2d5] aspect-square"
                >
                  <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setGallery(p => p.filter((_, j) => j !== i))}
                    className="absolute top-1.5 right-1.5 p-1 bg-white/90 backdrop-blur rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
              {gallery.length < 20 && (
                <button
                  type="button"
                  onClick={() => triggerUpload('gallery')}
                  disabled={uploadingMedia === 'gallery'}
                  className="aspect-square flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#e0d8cc] text-[#aab4be] hover:text-[#1084a2] hover:border-[#1084a2]/50 hover:bg-[#1084a2]/5 transition-all disabled:opacity-50"
                >
                  {uploadingMedia === 'gallery'
                    ? <Loader2 size={18} className="animate-spin" />
                    : <Plus size={18} />
                  }
                  <span className="text-[11px] font-medium">Add Photo</span>
                </button>
              )}
            </div>
          </div>

          {/* Videos grid */}
          <div className="space-y-2 pt-4 border-t border-[#f0ebe0]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8b9aaa]">
              Videos
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {videos.map((url, i) => (
                <div
                  key={i}
                  className="relative group rounded-xl overflow-hidden border border-[#e8e2d5] aspect-video bg-black"
                >
                  <video src={url} className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={() => setVideos(p => p.filter((_, j) => j !== i))}
                    className="absolute top-1.5 right-1.5 p-1 bg-white/90 backdrop-blur rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => triggerUpload('video')}
                disabled={uploadingMedia === 'video'}
                className="aspect-video flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#e0d8cc] text-[#aab4be] hover:text-[#1084a2] hover:border-[#1084a2]/50 hover:bg-[#1084a2]/5 transition-all disabled:opacity-50"
              >
                {uploadingMedia === 'video'
                  ? <Loader2 size={18} className="animate-spin" />
                  : <Film size={18} />
                }
                <span className="text-[11px] font-medium">Add Video</span>
              </button>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── Footer actions ───────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 pt-1 pb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#3d4852] bg-white border border-[#e8e2d5] hover:bg-[#faf7f0] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #1084a2, #1a9bbf)' }}
        >
          {isSubmitting
            ? <><Loader2 size={15} className="animate-spin" /> Saving…</>
            : <>{education ? 'Update Education' : 'Save Education'} <ChevronRight size={15} /></>
          }
        </button>
      </div>
    </form>
  );
}

/* ── Upload drop zone ─────────────────────────────────────────── */
function UploadZone({
  label,
  icon,
  loading,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full aspect-video flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#e0d8cc] text-[#aab4be] hover:text-[#1084a2] hover:border-[#1084a2]/50 hover:bg-[#1084a2]/5 transition-all duration-150 disabled:opacity-50 group"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#e8e2d5] bg-[#faf7f0] group-hover:border-[#1084a2]/30 group-hover:bg-[#1084a2]/5 transition-all">
        {loading ? <Loader2 size={18} className="animate-spin text-[#1084a2]" /> : icon}
      </div>
      <span className="text-xs font-semibold">{loading ? 'Uploading…' : label}</span>
    </button>
  );
}
