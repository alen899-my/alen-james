'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createBlogAction, updateBlogAction } from '@/lib/admin/actions/blogs.actions';
import { Blog } from '@/lib/admin/models/blogs.model';
import {
  Upload, X, Loader2, FileText, Paperclip, ChevronRight,
  Image as ImageIcon, Film, Settings, Calendar
} from 'lucide-react';

interface BlogFormProps {
  blog?: Blog;
}

/* ── reusable primitives ─────────────────────────────────── */

function SectionCard({ icon, title, subtitle, children }: { icon: React.ReactNode; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#f0ebe0]" style={{ background: 'linear-gradient(to bottom, #fdf9f2, #f7f2e8)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1084a2, #1a9bbf)' }}>
          <span className="text-white">{icon}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1a1a1a] leading-none">{title}</p>
          {subtitle && <p className="text-xs text-[#8b9aaa] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
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

const inputCls = 'w-full px-4 py-2.5 bg-[#fdfbf7] border border-[#e8e2d5] rounded-xl text-sm text-[#1a1a1a] placeholder:text-[#c4bdb0] focus:outline-none focus:border-[#1084a2] focus:ring-2 focus:ring-[#1084a2]/15 transition-all duration-150';

/* ── main component ───────────────────────────────────────────── */

export default function BlogForm({ blog }: BlogFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mainImage, setMainImage] = useState<string>(blog?.main_image || '');
  const [videoUrl, setVideoUrl] = useState<string>(blog?.video_url || '');
  const [status, setStatus] = useState<'active' | 'inactive'>(blog?.status || 'active');
  const [uploadingMedia, setUploadingMedia] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<'main' | 'video' | null>(null);

  /* handlers */
  const triggerUpload = (target: 'main' | 'video') => {
    setUploadTarget(target);
    if (fileInputRef.current) {
      fileInputRef.current.accept = target === 'video' ? 'video/*' : 'image/*';
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
        if (uploadTarget === 'main') setMainImage(data.url);
        else if (uploadTarget === 'video') setVideoUrl(data.url);
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
    formData.set('main_image', mainImage);
    formData.set('video_url', videoUrl);
    formData.set('status', status);
    
    const res = blog
      ? await updateBlogAction(blog.id, formData)
      : await createBlogAction(null, formData);
      
    setIsSubmitting(false);
    
    if (res.success) { 
      router.push('/admin/blogs'); 
      router.refresh(); 
    }
    else setError(res.error || 'Something went wrong.');
  };

  const defaultDate = blog?.publish_date 
    ? new Date(blog.publish_date).toISOString().slice(0, 16) 
    : '';

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl">

      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600">
          <X size={16} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* ── 1. Content ─────────────────────────────────── */}
      <SectionCard
        icon={<FileText size={15} />}
        title="Blog Details"
        subtitle="Write your blog post"
      >
        <div className="space-y-4">
          <Field label="Title" required>
            <input
              type="text"
              name="title"
              defaultValue={blog?.title || ''}
              required
              placeholder="e.g. Next.js 14 Best Practices"
              className={inputCls}
            />
          </Field>

          <Field label="Publish Date">
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aab4be]" />
              <input
                type="datetime-local"
                name="publish_date"
                defaultValue={defaultDate}
                className={`${inputCls} pl-10`}
              />
            </div>
          </Field>

          <Field label="Full Description / Content">
            <textarea
              name="description"
              defaultValue={blog?.description || ''}
              rows={15}
              placeholder="Write your blog content here..."
              className={`${inputCls} resize-y min-h-[250px]`}
            />
          </Field>
        </div>
      </SectionCard>

      {/* ── 2. Media ─────────────────────────────────────────── */}
      <SectionCard
        icon={<Paperclip size={15} />}
        title="Media"
        subtitle="Images and video"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8b9aaa]">
              Cover Image
            </p>
            {mainImage ? (
              <div className="relative group rounded-xl overflow-hidden border border-[#e8e2d5] aspect-video">
                <img src={mainImage} alt="Main" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button type="button" onClick={() => triggerUpload('main')} className="p-2 bg-white rounded-lg text-[#1a1a1a] hover:text-[#1084a2] shadow">
                    <Upload size={15} />
                  </button>
                  <button type="button" onClick={() => setMainImage('')} className="p-2 bg-white rounded-lg text-red-500 shadow">
                    <X size={15} />
                  </button>
                </div>
              </div>
            ) : (
              <UploadZone
                label="Upload Cover Image"
                icon={<ImageIcon size={22} />}
                loading={uploadingMedia === 'main'}
                onClick={() => triggerUpload('main')}
              />
            )}
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8b9aaa]">
              Featured Video <span className="text-[#c4bdb0] normal-case font-normal">(optional)</span>
            </p>
            {videoUrl ? (
              <div className="relative group rounded-xl overflow-hidden border border-[#e8e2d5] aspect-video bg-black">
                <video src={videoUrl} controls className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                  <button type="button" onClick={() => triggerUpload('video')} className="p-2 bg-white rounded-lg text-[#1a1a1a] hover:text-[#1084a2] shadow">
                    <Upload size={15} />
                  </button>
                  <button type="button" onClick={() => setVideoUrl('')} className="p-2 bg-white rounded-lg text-red-500 shadow">
                    <X size={15} />
                  </button>
                </div>
              </div>
            ) : (
              <UploadZone
                label="Upload Video"
                icon={<Film size={22} />}
                loading={uploadingMedia === 'video'}
                onClick={() => triggerUpload('video')}
              />
            )}
          </div>
        </div>
      </SectionCard>

      {/* ── 3. Settings ─────────────────────────────────── */}
      <SectionCard
        icon={<Settings size={15} />}
        title="Settings"
        subtitle="Publishing status"
      >
        <div className="space-y-6">
          <Field label="Status">
            <div className="flex gap-4">
              <label className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl cursor-pointer transition-all ${status === 'active' ? 'bg-[#1084a2]/5 border-[#1084a2]' : 'bg-white border-[#e8e2d5]'}`}>
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={status === 'active'}
                  onChange={(e) => setStatus(e.target.value as 'active')}
                  className="w-4 h-4 text-[#1084a2] focus:ring-[#1084a2]"
                />
                <span className="text-sm font-medium text-[#1a1a1a]">Active (Published)</span>
              </label>
              
              <label className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl cursor-pointer transition-all ${status === 'inactive' ? 'bg-gray-50 border-gray-300' : 'bg-white border-[#e8e2d5]'}`}>
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={status === 'inactive'}
                  onChange={(e) => setStatus(e.target.value as 'inactive')}
                  className="w-4 h-4 text-gray-600 focus:ring-gray-500"
                />
                <span className="text-sm font-medium text-[#1a1a1a]">Inactive (Draft)</span>
              </label>
            </div>
          </Field>
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
            : <>{blog ? 'Update Blog' : 'Publish Blog'} <ChevronRight size={15} /></>
          }
        </button>
      </div>
    </form>
  );
}

/* ── Upload drop zone ─────────────────────────────────────────── */
function UploadZone({ label, icon, loading, onClick }: { label: string; icon: React.ReactNode; loading: boolean; onClick: () => void; }) {
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
