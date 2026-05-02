'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPersonAction, updatePersonAction } from '@/lib/admin/actions/people.actions';
import { Person } from '@/lib/admin/models/people.model';
import {
  Upload, X, Plus, Loader2, User, Paperclip, ChevronRight,
  Shield, Film, Users
} from 'lucide-react';

interface PersonFormProps {
  person?: Person;
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

export default function PersonForm({ person }: PersonFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [images, setImages] = useState<string[]>(person?.images || []);
  const [videos, setVideos] = useState<string[]>(person?.videos || []);
  const [isPublic, setIsPublic] = useState<boolean>(person?.is_public ?? false);
  const [uploadTarget, setUploadTarget] = useState<'image' | 'video' | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* handlers */
  const triggerUpload = (type: 'image' | 'video') => {
    setUploadTarget(type);
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : 'video/*';
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget) return;
    
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        if (uploadTarget === 'image') setImages(p => [...p, data.url]);
        else setVideos(p => [...p, data.url]);
      } else alert(data.error || 'Upload failed');
    } catch {
      alert('Upload failed');
    } finally {
      setUploadTarget(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    formData.set('images', JSON.stringify(images));
    formData.set('videos', JSON.stringify(videos));
    formData.set('is_public', isPublic.toString());
    
    const res = person
      ? await updatePersonAction(person.id, formData)
      : await createPersonAction(null, formData);
      
    setIsSubmitting(false);
    
    if (res.success) { 
      router.push('/admin/people'); 
      router.refresh(); 
    }
    else setError(res.error || 'Something went wrong.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl">

      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600">
          <X size={16} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* ── 1. Basic Details ─────────────────────────────────── */}
      <SectionCard
        icon={<User size={15} />}
        title="Person Details"
        subtitle="Information about the person"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name" required>
              <input
                type="text"
                name="name"
                defaultValue={person?.name || ''}
                required
                placeholder="e.g. John Doe"
                className={inputCls}
              />
            </Field>

            <Field label="Relation">
              <input
                type="text"
                name="relation"
                defaultValue={person?.relation || ''}
                placeholder="e.g. Friend, Colleague, Family"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="About Them">
            <textarea
              name="about_them"
              defaultValue={person?.about_them || ''}
              rows={8}
              placeholder="Write something about this person..."
              className={`${inputCls} resize-y`}
            />
          </Field>
        </div>
      </SectionCard>

      {/* ── 2. Security & Privacy ─────────────────────────────────── */}
      <SectionCard
        icon={<Shield size={15} />}
        title="Privacy Settings"
        subtitle="Control who can see this person's profile"
      >
        <div className="space-y-6">
          <div className="flex items-start gap-4 p-4 rounded-xl border border-[#e8e2d5] bg-[#faf7f0]">
            <input
              type="checkbox"
              id="is_public"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-[#c4bdb0] text-[#1084a2] focus:ring-[#1084a2]"
            />
            <div>
              <label htmlFor="is_public" className="text-sm font-semibold text-[#1a1a1a] cursor-pointer block">
                Make Publicly Visible
              </label>
              <p className="text-xs text-[#8b9aaa] mt-1">
                If checked, anyone visiting the website can read this profile. If unchecked, it remains secret.
              </p>
            </div>
          </div>

          <Field label="Individual Password Protection (Optional)">
            <input
              type="text"
              name="password"
              defaultValue={person?.password || ''}
              placeholder="Leave blank for no password"
              className={inputCls}
            />
            <p className="text-[11px] text-[#aab4be] mt-1.5">
              If you set a password here, users will need to enter it to view this specific profile, even if it's public.
            </p>
          </Field>
        </div>
      </SectionCard>

      {/* ── 3. Media ─────────────────────────────────────────── */}
      <SectionCard
        icon={<Paperclip size={15} />}
        title="Media Gallery"
        subtitle="Images and videos with this person"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8b9aaa] mb-3">Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((url, i) => (
                <div key={`img-${i}`} className="relative group rounded-xl overflow-hidden border border-[#e8e2d5] aspect-square">
                  <img src={url} alt={`Gallery image ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages(p => p.filter((_, j) => j !== i))}
                    className="absolute top-1.5 right-1.5 p-1 bg-white/90 backdrop-blur rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => triggerUpload('image')}
                disabled={uploadTarget === 'image'}
                className="aspect-square flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#e0d8cc] text-[#aab4be] hover:text-[#1084a2] hover:border-[#1084a2]/50 hover:bg-[#1084a2]/5 transition-all disabled:opacity-50"
              >
                {uploadTarget === 'image' ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                <span className="text-[11px] font-medium">Add Image</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8b9aaa] mb-3">Videos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {videos.map((url, i) => (
                <div key={`vid-${i}`} className="relative group rounded-xl overflow-hidden border border-[#e8e2d5] bg-black aspect-video">
                  <video src={url} controls className="w-full h-full object-contain" />
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
                disabled={uploadTarget === 'video'}
                className="aspect-video flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#e0d8cc] text-[#aab4be] hover:text-[#1084a2] hover:border-[#1084a2]/50 hover:bg-[#1084a2]/5 transition-all disabled:opacity-50"
              >
                {uploadTarget === 'video' ? <Loader2 size={18} className="animate-spin" /> : <Film size={18} />}
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
            : <>{person ? 'Update Profile' : 'Save Profile'} <ChevronRight size={15} /></>
          }
        </button>
      </div>
    </form>
  );
}
