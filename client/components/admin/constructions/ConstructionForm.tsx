'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createConstructionAction, updateConstructionAction } from '@/lib/admin/actions/constructions.actions';
import { Construction } from '@/lib/admin/models/constructions.model';
import { Upload, X, Plus, Image as ImageIcon, Loader2, Layers, FileText, ChevronRight, HardHat } from 'lucide-react';

interface ConstructionFormProps {
  construction?: Construction;
}

/* ── tiny reusable primitives ─────────────────────────────────── */

function SectionCard({ icon, title, subtitle, children }: {
  icon: React.ReactNode; title: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#f0ebe0]"
        style={{ background: 'linear-gradient(to bottom, #fdf9f2, #f7f2e8)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #1084a2, #1a9bbf)' }}>
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

function Field({ label, required, children }: {
  label: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-[#8b9aaa]">
        {label}{required && <span className="ml-1 text-[#1084a2]">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full px-4 py-2.5 bg-[#fdfbf7] border border-[#e8e2d5] rounded-xl text-sm text-[#1a1a1a] placeholder:text-[#c4bdb0] focus:outline-none focus:border-[#1084a2] focus:ring-2 focus:ring-[#1084a2]/15 transition-all duration-150';

const PHASES = ['Planning', 'Design', 'Development', 'Testing', 'Beta', 'Almost Done'];

/* ── main component ───────────────────────────────────────────── */

export default function ConstructionForm({ construction }: ConstructionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [stacks, setStacks] = useState<string[]>(construction?.stacks || []);
  const [newStack, setNewStack] = useState('');
  const [isUpcoming, setIsUpcoming] = useState(construction?.is_upcoming ?? false);
  const [status, setStatus] = useState<'active' | 'inactive'>(construction?.status || 'active');
  const [mainImage, setMainImage] = useState<{ url: string; file: File | null }>({
    url: construction?.main_image || '',
    file: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStackAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newStack.trim()) {
      e.preventDefault();
      if (!stacks.includes(newStack.trim())) setStacks([...stacks, newStack.trim()]);
      setNewStack('');
    }
  };

  const uploadToApi = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok || !data.url) throw new Error(data.error || 'Upload failed');
    return data.url;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setMainImage({ url: previewUrl, file });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;

    try {
      const finalImage = mainImage.file
        ? await uploadToApi(mainImage.file)
        : mainImage.url;

      const formData = new FormData(form);
      formData.set('stacks', JSON.stringify(stacks));
      formData.set('main_image', finalImage);
      formData.set('is_upcoming', String(isUpcoming));
      formData.set('status', status);

      const res = construction
        ? await updateConstructionAction(construction.id, formData)
        : await createConstructionAction(null, formData);

      if (res.success) {
        router.push('/admin/constructions');
        router.refresh();
      } else {
        setError(res.error || 'Something went wrong.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600">
          <X size={16} className="flex-shrink-0 mt-0.5" /> {error}
        </div>
      )}

      {/* ── 1. Basic Details ── */}
      <SectionCard icon={<Layers size={15} />} title="Basic Details" subtitle="Project identity">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Project Name" required>
            <input type="text" name="name" defaultValue={construction?.name || ''} required
              placeholder="e.g. SpotMe App" className={inputCls} />
          </Field>

          <Field label="Tagline">
            <input type="text" name="tagline" defaultValue={construction?.tagline || ''}
              placeholder="e.g. Real-time friend finder" className={inputCls} />
          </Field>

          <Field label="Construction Phase">
            <select name="construction_phase"
              defaultValue={construction?.construction_phase || 'Planning'}
              className={`${inputCls} appearance-none cursor-pointer`}>
              {PHASES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>

          <Field label="Stacks / Technologies">
            <div
              className={`${inputCls} !py-2 flex flex-wrap gap-1.5 min-h-[46px] cursor-text`}
              onClick={() => (document.getElementById('stack-input') as HTMLInputElement)?.focus()}
            >
              {stacks.map(s => (
                <span key={s}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#1084a2] border border-[#1084a2]/25"
                  style={{ background: 'rgba(16,132,162,0.07)' }}>
                  {s}
                  <button type="button" onClick={() => setStacks(t => t.filter(x => x !== s))}
                    className="hover:text-red-500 transition-colors ml-0.5"><X size={11} /></button>
                </span>
              ))}
              <input id="stack-input" type="text" value={newStack}
                onChange={e => setNewStack(e.target.value)} onKeyDown={handleStackAdd}
                placeholder={stacks.length === 0 ? 'Type and press Enter…' : 'Add more…'}
                className="flex-1 min-w-[130px] bg-transparent text-sm focus:outline-none" />
            </div>
          </Field>

          {/* Toggles */}
          <div className="sm:col-span-2 flex flex-wrap gap-6">
            {/* Upcoming toggle */}
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setIsUpcoming(v => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors ${isUpcoming ? 'bg-[#1084a2]' : 'bg-[#e8e2d5]'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isUpcoming ? 'translate-x-5' : ''}`} />
              </button>
              <div>
                <p className="text-sm font-semibold text-[#1a1a1a]">Upcoming / Future</p>
                <p className="text-xs text-[#8b9aaa]">{isUpcoming ? 'Shown in "Coming Soon" section' : 'Shown in "Currently Building"'}</p>
              </div>
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setStatus(v => v === 'active' ? 'inactive' : 'active')}
                className={`relative w-11 h-6 rounded-full transition-colors ${status === 'active' ? 'bg-emerald-500' : 'bg-[#e8e2d5]'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${status === 'active' ? 'translate-x-5' : ''}`} />
              </button>
              <div>
                <p className="text-sm font-semibold text-[#1a1a1a]">Visible on site</p>
                <p className="text-xs text-[#8b9aaa]">{status === 'active' ? 'Publicly visible' : 'Hidden from frontend'}</p>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── 2. Content ── */}
      <SectionCard icon={<FileText size={15} />} title="Content" subtitle="Idea and features">
        <div className="space-y-4">
          <Field label="Project Idea">
            <textarea name="project_idea" defaultValue={construction?.project_idea || ''} rows={4}
              placeholder="What is this project about? What problem does it solve?"
              className={`${inputCls} resize-y`} />
          </Field>
          <Field label="Planned Features">
            <textarea name="features" defaultValue={construction?.features || ''} rows={5}
              placeholder="List the key features you're planning to build…"
              className={`${inputCls} resize-y`} />
          </Field>
        </div>
      </SectionCard>

      {/* ── 3. Image ── */}
      <SectionCard icon={<HardHat size={15} />} title="Cover Image" subtitle="Project thumbnail">
        {mainImage.url ? (
          <div className="relative group rounded-xl overflow-hidden border border-[#e8e2d5] aspect-video max-w-sm">
            <img src={mainImage.url} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white rounded-lg text-[#1a1a1a] hover:text-[#1084a2] shadow"><Upload size={15} /></button>
              <button type="button" onClick={() => setMainImage({ url: '', file: null })}
                className="p-2 bg-white rounded-lg text-red-500 shadow"><X size={15} /></button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-sm aspect-video flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#e0d8cc] text-[#aab4be] hover:text-[#1084a2] hover:border-[#1084a2]/50 hover:bg-[#1084a2]/5 transition-all">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#e8e2d5] bg-[#faf7f0]">
              <ImageIcon size={18} />
            </div>
            <span className="text-xs font-semibold">Upload Cover Image</span>
          </button>
        )}
      </SectionCard>

      {/* ── Footer ── */}
      <div className="flex items-center justify-end gap-3 pt-1 pb-8">
        <button type="button" onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#3d4852] bg-white border border-[#e8e2d5] hover:bg-[#faf7f0] transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #1084a2, #1a9bbf)' }}>
          {isSubmitting
            ? <><Loader2 size={15} className="animate-spin" /> Saving…</>
            : <>{construction ? 'Update Entry' : 'Save Entry'} <ChevronRight size={15} /></>
          }
        </button>
      </div>
    </form>
  );
}
