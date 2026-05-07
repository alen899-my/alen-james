'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createResumeAction, updateResumeAction } from '@/lib/admin/actions/resumes.actions';
import { Resume } from '@/lib/admin/models/resumes.model';
import {
  Upload, X, CheckCircle, Loader2, ScrollText, Paperclip, ChevronRight,
  FileText, ExternalLink
} from 'lucide-react';

interface MediaFile {
  url: string;
  file: File | null;
}

interface ResumeFormProps {
  resume?: Resume;
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

export default function ResumeForm({ resume }: ResumeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [resumeFile, setResumeFile] = useState<MediaFile>({ 
    url: resume?.file_url || '', 
    file: null 
  });
  const [isActive, setIsActive] = useState(resume?.is_active || false);

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
    setResumeFile({ url: previewUrl, file });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resumeFile.url) return setError('Please upload a resume file.');
    
    setIsSubmitting(true);
    setError(null);
    
    const form = e.currentTarget;
    
    try {
      const finalFileUrl = resumeFile.file ? await uploadToApi(resumeFile.file) : resumeFile.url;

      const formData = new FormData(form);
      formData.set('file_url', finalFileUrl);
      formData.set('is_active', String(isActive));
      
      const res = resume
        ? await updateResumeAction(resume.id, formData)
        : await createResumeAction(null, formData);
        
      if (res.success) { 
        router.push('/admin/resumes'); 
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
        accept=".pdf,.doc,.docx"
      />

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600">
          <X size={16} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* ── Resume Details ── */}
      <SectionCard
        icon={<ScrollText size={15} />}
        title="Resume Details"
        subtitle="Manage your professional document"
      >
        <div className="space-y-5">
          <Field label="Resume Name / Label" required>
            <input
              type="text"
              name="name"
              defaultValue={resume?.name || ''}
              required
              placeholder="e.g. Senior Software Engineer Resume"
              className={inputCls}
            />
          </Field>

          <Field label="Upload PDF / Document" required>
            {resumeFile.url ? (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#faf7f0] border border-[#e8e2d5]">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-[#e8e2d5] text-red-500">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1a1a1a] truncate">Resume File Attached</p>
                  <a 
                    href={resumeFile.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-[#1084a2] hover:underline flex items-center gap-1 mt-0.5"
                  >
                    View Current File <ExternalLink size={10} />
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => setResumeFile({ url: '', file: null })}
                  className="p-2 text-[#8b9aaa] hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
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
                  <p className="text-sm font-semibold text-[#3d4852]">Click to upload resume</p>
                  <p className="text-xs mt-1">PDF preferred (Max 10MB)</p>
                </div>
              </button>
            )}
          </Field>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[#faf7f0]/50 border border-[#e8e2d5]">
            <div>
              <p className="text-sm font-bold text-[#1a1a1a]">Set as Active</p>
              <p className="text-xs text-[#8b9aaa] mt-0.5">Use this resume for the public "Download CV" button</p>
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
            : <>{resume ? 'Update Resume' : 'Save Resume'} <ChevronRight size={15} /></>
          }
        </button>
      </div>
    </form>
  );
}
