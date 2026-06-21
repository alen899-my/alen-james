'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createWhatsNewAction, updateWhatsNewAction } from '@/lib/admin/actions/whats_new.actions';
import { WhatsNew } from '@/lib/admin/models/whats_new.model';
import {
  Upload, X, CheckCircle, Loader2, Sparkles, Image as ImageIcon, Link as LinkIcon, ChevronRight,
  FileText, ExternalLink
} from 'lucide-react';

interface MediaFile {
  url: string;
  file: File | null;
}

interface WhatsNewFormProps {
  item?: WhatsNew;
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

export default function WhatsNewForm({ item }: WhatsNewFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<MediaFile>({ 
    url: item?.image_url || '', 
    file: null 
  });
  const [isActive, setIsActive] = useState(item?.is_active || false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToApi = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok || !data.url) throw new Error(data.error || 'Upload failed');
    return data.url;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const previewUrl = URL.createObjectURL(file);
    setImageFile({ url: previewUrl, file });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const form = e.currentTarget;
    
    try {
      const finalImageUrl = imageFile.file ? await uploadToApi(imageFile.file) : imageFile.url;

      const formData = new FormData(form);
      formData.set('image_url', finalImageUrl);
      formData.set('is_active', String(isActive));
      
      const res = item
        ? await updateWhatsNewAction(item.id, formData)
        : await createWhatsNewAction(null, formData);
        
      if (res.success) { 
        router.push('/admin/whats-new'); 
        router.refresh(); 
      }
      else {
        setError(res.error || 'Something went wrong.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed during submission.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl mx-auto">

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept="image/*"
      />

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600">
          <X size={16} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* ── Announcement Details ── */}
      <SectionCard
        icon={<Sparkles size={15} />}
        title="Announcement Details"
        subtitle="Manage the 'What's New' pop card information"
      >
        <div className="space-y-5">
          <Field label="Title / Header" required>
            <input
              type="text"
              name="title"
              defaultValue={item?.title || ''}
              required
              placeholder="e.g. My Latest Work Plan!"
              className={inputCls}
            />
          </Field>

          <Field label="Content / Description" required>
            <textarea
              name="content"
              defaultValue={item?.content || ''}
              required
              rows={5}
              placeholder="Describe what's new. You can list key milestones or work plan items."
              className={`${inputCls} resize-y`}
            />
          </Field>

          <Field label="Upload Cover Image">
            {imageFile.url ? (
              <div className="flex flex-col gap-3 p-4 rounded-xl bg-[#faf7f0] border border-[#e8e2d5]">
                <div className="relative aspect-video rounded-lg overflow-hidden border border-[#e8e2d5] bg-black max-w-sm">
                  <img src={imageFile.url} alt="Cover Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageFile({ url: '', file: null })}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors shadow"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="text-xs text-[#8b9aaa]">Image uploaded. This image will show at the top of the popup card.</p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                className="w-full py-10 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#e0d8cc] text-[#aab4be] hover:text-[#1084a2] hover:border-[#1084a2]/50 hover:bg-[#1084a2]/5 transition-all disabled:opacity-50"
              >
                <Upload size={24} />
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#3d4852]">Click to upload announcement banner</p>
                  <p className="text-xs mt-1">PNG, JPG, or WEBP (Max 5MB)</p>
                </div>
              </button>
            )}
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Action Button Text">
              <input
                type="text"
                name="btn_text"
                defaultValue={item?.btn_text || ''}
                placeholder="e.g. Check it out"
                className={inputCls}
              />
            </Field>

            <Field label="Action Button Link (URL)">
              <input
                type="text"
                name="btn_url"
                defaultValue={item?.btn_url || ''}
                placeholder="e.g. /works or https://..."
                className={inputCls}
              />
            </Field>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[#faf7f0]/50 border border-[#e8e2d5]">
            <div>
              <p className="text-sm font-bold text-[#1a1a1a]">Set as Active</p>
              <p className="text-xs text-[#8b9aaa] mt-0.5">Show this pop card when users open the public site. Only one popup can be active at a time.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isActive ? 'bg-[#1084a2]' : 'bg-[#e8e2d5]'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
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
            : <>{item ? 'Update Announcement' : 'Save Announcement'} <ChevronRight size={15} /></>
          }
        </button>
      </div>
    </form>
  );
}
