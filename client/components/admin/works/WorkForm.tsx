'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createWorkAction, updateWorkAction } from '@/lib/admin/actions/works.actions';
import { Work } from '@/lib/admin/models/works.model';
import { WorkCategory } from '@/lib/admin/models/work_categories.model';
import { Skill } from '@/lib/admin/models/skills.model';
import {
  Upload, X, Plus, Image as ImageIcon, Film,
  Loader2, Layers, FileText, Paperclip, ChevronRight, Tag, BrainCircuit
} from 'lucide-react';

interface WorkFormProps {
  work?: Work;
  categories: WorkCategory[];
  skills: Skill[];
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

interface MediaFile {
  url: string;
  file: File | null;
}

export default function WorkForm({ work, categories, skills }: WorkFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [techStacks, setTechStacks] = useState<string[]>(work?.tech_stacks || []);
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>(work?.skill_ids || []);
  const [newTech, setNewTech] = useState('');
  const [screenshots, setScreenshots] = useState<MediaFile[]>(
    (work?.screenshots || []).map(url => ({ url, file: null }))
  );
  const [additionalVideos, setAdditionalVideos] = useState<MediaFile[]>(
    (work?.additional_videos || []).map(url => ({ url, file: null }))
  );
  const [mainImage, setMainImage] = useState<MediaFile>({ 
    url: work?.main_image || '', 
    file: null 
  });
  const [videoUrl, setVideoUrl] = useState<MediaFile>({ 
    url: work?.video_url || '', 
    file: null 
  });
  const [uploadingMedia, setUploadingMedia] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<
    'main' | 'screenshot' | 'video' | 'additional_video' | null
  >(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  /* handlers */
  const handleTechAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTech.trim()) {
      e.preventDefault();
      if (!techStacks.includes(newTech.trim()))
        setTechStacks([...techStacks, newTech.trim()]);
      setNewTech('');
    }
  };

  const triggerUpload = (target: 'main' | 'screenshot' | 'video' | 'additional_video', index?: number) => {
    setUploadTarget(target);
    setEditingIndex(index !== undefined ? index : null);
    if (fileInputRef.current) {
      fileInputRef.current.accept =
        target === 'video' || target === 'additional_video' ? 'video/*' : 'image/*';
      fileInputRef.current.click();
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget) return;
    
    const previewUrl = URL.createObjectURL(file);
    const item = { url: previewUrl, file };

    if (uploadTarget === 'main') setMainImage(item);
    else if (uploadTarget === 'video') setVideoUrl(item);
    else if (uploadTarget === 'screenshot') {
      if (editingIndex !== null) {
        const newS = [...screenshots];
        newS[editingIndex] = item;
        setScreenshots(newS);
      } else {
        setScreenshots(p => [...p, item]);
      }
    } else if (uploadTarget === 'additional_video') {
      if (editingIndex !== null) {
        const newV = [...additionalVideos];
        newV[editingIndex] = item;
        setAdditionalVideos(newV);
      } else {
        setAdditionalVideos(p => [...p, item]);
      }
    }

    setUploadTarget(null);
    setEditingIndex(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;

    try {
      // 1. Upload new files if any
      const [finalMainImage, finalVideoUrl] = await Promise.all([
        mainImage.file ? uploadToApi(mainImage.file) : Promise.resolve(mainImage.url),
        videoUrl.file ? uploadToApi(videoUrl.file) : Promise.resolve(videoUrl.url)
      ]);

      const finalScreenshots = await Promise.all(
        screenshots.map(s => s.file ? uploadToApi(s.file) : Promise.resolve(s.url))
      );

      const finalAdditionalVideos = await Promise.all(
        additionalVideos.map(v => v.file ? uploadToApi(v.file) : Promise.resolve(v.url))
      );

      const formData = new FormData(form);
      formData.set('tech_stacks', JSON.stringify(techStacks));
      formData.set('skill_ids', JSON.stringify(selectedSkillIds));
      formData.set('screenshots', JSON.stringify(finalScreenshots));
      formData.set('additional_videos', JSON.stringify(finalAdditionalVideos));
      formData.set('main_image', finalMainImage);
      formData.set('video_url', finalVideoUrl);

      const res = work
        ? await updateWorkAction(work.id, formData)
        : await createWorkAction(null, formData);

      if (res.success) {
        router.push('/admin/works');
        router.refresh();
      } else {
        setError(res.error || 'Something went wrong.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed during submission.');
      setIsSubmitting(false);
    }
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
        icon={<Layers size={15} />}
        title="Basic Details"
        subtitle="Core project information"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Project Title" required>
            <input
              type="text"
              name="title"
              defaultValue={work?.title || ''}
              required
              placeholder="e.g. Parkora Maritime Platform"
              className={inputCls}
            />
          </Field>

          <Field label="Short Subtitle">
            <input
              type="text"
              name="subtitle"
              defaultValue={work?.subtitle || ''}
              placeholder="e.g. Fleet & crew management SaaS"
              className={inputCls}
            />
          </Field>

          <Field label="Year">
            <input
              type="text"
              name="year"
              defaultValue={work?.year || ''}
              placeholder="2024"
              className={inputCls}
            />
          </Field>

          <Field label="Project Category">
            <select
              name="category_id"
              defaultValue={work?.category_id || ''}
              className={`${inputCls} appearance-none cursor-pointer`}
            >
              <option value="">Uncategorized</option>
              {categories?.map((cat: WorkCategory) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Live Site Link">

            <input
              type="url"
              name="live_link"
              defaultValue={work?.live_link || ''}
              placeholder="https://"
              className={inputCls}
            />
          </Field>

          <div className="sm:col-span-2 space-y-4">
            <Field label="Technologies Used (Skills Library)">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {skills?.map((skill) => {
                  const isSelected = selectedSkillIds.includes(skill.id);
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedSkillIds(selectedSkillIds.filter(id => id !== skill.id));
                        } else {
                          setSelectedSkillIds([...selectedSkillIds, skill.id]);
                        }
                      }}
                      className={`flex items-center gap-2 p-2 rounded-xl border transition-all text-left ${
                        isSelected 
                          ? 'border-[#1084a2] bg-[#1084a2]/5 text-[#1084a2] shadow-sm' 
                          : 'border-[#e8e2d5] bg-white text-[#8b9aaa] hover:border-[#1084a2]/30 hover:bg-[#faf7f0]'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-[#1084a2]/10' : 'bg-[#faf7f0]'}`}>
                        {skill.image ? (
                          <img src={skill.image} alt={skill.name} className="w-5 h-5 object-contain" />
                        ) : (
                          <BrainCircuit size={16} />
                        )}
                      </div>
                      <span className="text-xs font-semibold truncate">{skill.name}</span>
                      {isSelected && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1084a2]" />}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Custom Tech Stacks (Tags)">
              <div
                className={`${inputCls} !py-2 flex flex-wrap gap-1.5 min-h-[46px] cursor-text`}
                onClick={() =>
                  (document.getElementById('tech-input') as HTMLInputElement)?.focus()
                }
              >
                {techStacks.map(tech => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#1084a2] border border-[#1084a2]/25"
                    style={{ background: 'rgba(16,132,162,0.07)' }}
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => setTechStacks(t => t.filter(x => x !== tech))}
                      className="hover:text-red-500 transition-colors ml-0.5"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
                <input
                  id="tech-input"
                  type="text"
                  value={newTech}
                  onChange={e => setNewTech(e.target.value)}
                  onKeyDown={handleTechAdd}
                  placeholder={techStacks.length === 0 ? 'Type and press Enter…' : 'Add more…'}
                  className="flex-1 min-w-[130px] bg-transparent text-sm focus:outline-none"
                />
              </div>
            </Field>
          </div>
        </div>
      </SectionCard>

      {/* ── 2. Content ───────────────────────────────────────── */}
      <SectionCard
        icon={<FileText size={15} />}
        title="Content"
        subtitle="Descriptions and write-up"
      >
        <div className="space-y-4">
          <Field label="Short Description">
            <textarea
              name="description"
              defaultValue={work?.description || ''}
              rows={3}
              placeholder="Brief overview shown on cards"
              className={`${inputCls} resize-y`}
            />
          </Field>

          <Field label="Introduction">
            <textarea
              name="introduction"
              defaultValue={work?.introduction || ''}
              rows={4}
              placeholder="Full intro paragraph for the project page"
              className={`${inputCls} resize-y`}
            />
          </Field>

          <Field label="What did I do?">
            <textarea
              name="what_i_did"
              defaultValue={work?.what_i_did || ''}
              rows={5}
              placeholder="Describe your role and contributions"
              className={`${inputCls} resize-y`}
            />
          </Field>
          <Field label="Key Features">
            <textarea
              name="key_features"
              defaultValue={work?.key_features || ''}
              rows={5}
              placeholder="List the standout features of the project"
              className={`${inputCls} resize-y`}
            />
          </Field>
        </div>

      </SectionCard>

      {/* ── 3. Media ─────────────────────────────────────────── */}
      <SectionCard
        icon={<Paperclip size={15} />}
        title="Media"
        subtitle="Images and videos"
      >
        <div className="space-y-6">

          {/* Main image + video row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Main image */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8b9aaa]">
                Main Image <span className="text-[#c4bdb0] normal-case font-normal">(card thumbnail)</span>
              </p>
              {mainImage.url ? (
                <div className="relative group rounded-xl overflow-hidden border border-[#e8e2d5] aspect-video">
                  <img src={mainImage.url} alt="Main" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => triggerUpload('main')}
                      className="p-2 bg-white rounded-lg text-[#1a1a1a] hover:text-[#1084a2] shadow"
                    >
                      <Upload size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMainImage({ url: '', file: null })}
                      className="p-2 bg-white rounded-lg text-red-500 shadow"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              ) : (
                <UploadZone
                  label="Upload Main Image"
                  icon={<ImageIcon size={22} />}
                  loading={uploadingMedia === 'main'}
                  onClick={() => triggerUpload('main')}
                />
              )}
            </div>

            {/* Video */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8b9aaa]">
                Project Video <span className="text-[#c4bdb0] normal-case font-normal">(optional)</span>
              </p>
              {videoUrl.url ? (
                <div className="relative group rounded-xl overflow-hidden border border-[#e8e2d5] aspect-video bg-black">
                  <video src={videoUrl.url} controls className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => triggerUpload('video')}
                      className="p-2 bg-white rounded-lg text-[#1a1a1a] hover:text-[#1084a2] shadow"
                    >
                      <Upload size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoUrl({ url: '', file: null })}
                      className="p-2 bg-white rounded-lg text-red-500 shadow"
                    >
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

          {/* Screenshots grid */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8b9aaa]">
              Screenshots
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {screenshots.map((item, i) => (
                <div
                  key={i}
                  className="relative group rounded-xl overflow-hidden border border-[#e8e2d5] aspect-video"
                >
                  <img src={item.url} alt={`Shot ${i + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => triggerUpload('screenshot', i)}
                      className="p-2 bg-white rounded-lg text-[#1a1a1a] hover:text-[#1084a2] shadow"
                    >
                      <Upload size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setScreenshots(p => p.filter((_, j) => j !== i))}
                      className="p-2 bg-white rounded-lg text-red-500 shadow"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => triggerUpload('screenshot')}
                disabled={uploadingMedia === 'screenshot'}
                className="aspect-video flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#e0d8cc] text-[#aab4be] hover:text-[#1084a2] hover:border-[#1084a2]/50 hover:bg-[#1084a2]/5 transition-all disabled:opacity-50"
              >
                {uploadingMedia === 'screenshot'
                  ? <Loader2 size={18} className="animate-spin" />
                  : <Plus size={18} />
                }
                <span className="text-[11px] font-medium">Add</span>
              </button>
            </div>
          </div>

          {/* Additional videos grid */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8b9aaa]">
              Additional Videos
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {additionalVideos.map((item, i) => (
                <div
                  key={i}
                  className="relative group rounded-xl overflow-hidden border border-[#e8e2d5] aspect-video bg-black"
                >
                  <video src={item.url} className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                    <button
                      type="button"
                      onClick={() => triggerUpload('additional_video', i)}
                      className="p-2 bg-white rounded-lg text-[#1a1a1a] hover:text-[#1084a2] shadow"
                    >
                      <Upload size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdditionalVideos(p => p.filter((_, j) => j !== i))}
                      className="p-2 bg-white rounded-lg text-red-500 shadow"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => triggerUpload('additional_video')}
                disabled={uploadingMedia === 'additional_video'}
                className="aspect-video flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#e0d8cc] text-[#aab4be] hover:text-[#1084a2] hover:border-[#1084a2]/50 hover:bg-[#1084a2]/5 transition-all disabled:opacity-50"
              >
                {uploadingMedia === 'additional_video'
                  ? <Loader2 size={18} className="animate-spin" />
                  : <Plus size={18} />
                }
                <span className="text-[11px] font-medium">Add</span>
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
            : <>{work ? 'Update Work' : 'Save Work'} <ChevronRight size={15} /></>
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