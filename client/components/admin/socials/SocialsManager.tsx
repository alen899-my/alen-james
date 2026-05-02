'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createSocialLinkAction, updateSocialLinkAction, deleteSocialLinkAction } from '@/lib/admin/actions/social_links.actions';
import { SocialLink } from '@/lib/admin/models/social_links.model';
import {
  Upload, X, Image as ImageIcon, Loader2,
  Pencil, Trash2, CheckCircle, Share2, Link as LinkIcon
} from 'lucide-react';

interface SocialsManagerProps {
  initialSocials: SocialLink[];
}

export default function SocialsManager({ initialSocials }: SocialsManagerProps) {
  const router = useRouter();
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  
  // Form State
  const [platform, setPlatform] = useState('');
  const [url, setUrl] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startEdit = (social: SocialLink) => {
    setEditingSocial(social);
    setPlatform(social.platform);
    setUrl(social.url);
    setIconUrl(social.icon_url || '');
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingSocial(null);
    setPlatform('');
    setUrl('');
    setIconUrl('');
    setError(null);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        setIconUrl(data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch {
      alert('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform.trim() || !url.trim()) return setError('Platform and URL are required');
    
    setIsSubmitting(true);
    setError(null);

    const fd = new FormData();
    fd.append('platform', platform);
    fd.append('url', url);
    fd.append('icon_url', iconUrl);

    let res;
    if (editingSocial) {
      res = await updateSocialLinkAction(editingSocial.id, fd);
    } else {
      res = await createSocialLinkAction(null, fd);
    }

    setIsSubmitting(false);

    if (res.success) {
      cancelEdit();
      router.refresh();
    } else {
      setError(res.error || 'Something went wrong');
    }
  };

  const handleDelete = async (id: number, platformName: string) => {
    if (!confirm(`Are you sure you want to delete the social link for "${platformName}"?`)) return;
    
    const res = await deleteSocialLinkAction(id);
    if (res.success) {
      if (editingSocial?.id === id) cancelEdit();
      router.refresh();
    } else {
      alert(res.error || 'Failed to delete social link');
    }
  };

  const inputCls = "w-full px-4 py-2.5 bg-[#fdfbf7] border border-[#e8e2d5] rounded-xl text-sm text-[#1a1a1a] placeholder:text-[#c4bdb0] focus:outline-none focus:border-[#1084a2] focus:ring-2 focus:ring-[#1084a2]/15 transition-all duration-150";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* ── LEFT: FORM ── */}
      <div className="lg:col-span-4 sticky top-6">
        <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[#f0ebe0]" style={{ background: 'linear-gradient(to bottom, #fdf9f2, #f7f2e8)' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1084a2, #1a9bbf)' }}>
              <Share2 size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1a1a1a] leading-none">
                {editingSocial ? 'Edit Social Link' : 'Add Social Link'}
              </p>
              <p className="text-xs text-[#8b9aaa] mt-0.5">
                {editingSocial ? `Updating ${editingSocial.platform}` : 'Link a new social profile'}
              </p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
                <X size={14} className="flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#8b9aaa]">Platform Name <span className="text-[#1084a2]">*</span></label>
              <input
                type="text"
                value={platform}
                onChange={e => setPlatform(e.target.value)}
                placeholder="e.g. LinkedIn, GitHub, YouTube"
                className={inputCls}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#8b9aaa]">Profile URL <span className="text-[#1084a2]">*</span></label>
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://..."
                className={inputCls}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#8b9aaa]">Social Icon</label>
              <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
              
              {iconUrl ? (
                <div className="relative group rounded-xl overflow-hidden border border-[#e8e2d5] h-28 bg-[#faf7f0] flex items-center justify-center">
                  <img src={iconUrl} alt="Icon" className="h-16 w-16 object-contain" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 bg-white rounded-lg text-[#1a1a1a] hover:text-[#1084a2]">
                      <Upload size={14} />
                    </button>
                    <button type="button" onClick={() => setIconUrl('')} className="p-2 bg-white rounded-lg text-red-500">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full h-28 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#e0d8cc] text-[#aab4be] hover:text-[#1084a2] hover:border-[#1084a2]/50 hover:bg-[#1084a2]/5 transition-all disabled:opacity-50"
                >
                  {uploading ? <Loader2 size={18} className="animate-spin text-[#1084a2]" /> : <ImageIcon size={20} />}
                  <span className="text-xs font-medium">{uploading ? 'Uploading...' : 'Upload Icon'}</span>
                </button>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              {editingSocial && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-[#3d4852] bg-white border border-[#e8e2d5] hover:bg-[#faf7f0] transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:shadow-md disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #1084a2, #1a9bbf)' }}
              >
                {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                {editingSocial ? 'Update Link' : 'Add Link'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── RIGHT: GRID ── */}
      <div className="lg:col-span-8">
        <div className="bg-white rounded-2xl border border-[#e8e2d5] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-[#1a1a1a]">Your Social Profiles</h2>
            <span className="text-xs font-semibold px-2.5 py-1 bg-[#faf7f0] text-[#8b9aaa] rounded-lg border border-[#e8e2d5]">
              {initialSocials.length} Total
            </span>
          </div>

          {initialSocials.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-[#e0d8cc] rounded-2xl bg-[#faf7f0]/50">
              <Share2 size={32} className="mx-auto text-[#aab4be] mb-3 opacity-50" />
              <p className="text-sm font-medium text-[#8b9aaa]">No social links added yet.</p>
              <p className="text-xs text-[#aab4be] mt-1">Use the form on the left to add your first profile.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {initialSocials.map(social => (
                <div 
                  key={social.id}
                  className={`group relative flex flex-col items-center p-5 rounded-2xl border transition-all duration-200 ${
                    editingSocial?.id === social.id 
                      ? 'border-[#1084a2] bg-[#1084a2]/5 shadow-sm' 
                      : 'border-[#e8e2d5] hover:border-[#1084a2]/30 hover:shadow-md hover:bg-white bg-[#fdfbf7]'
                  }`}
                >
                  {/* Actions overlay */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(social)}
                      className="p-1.5 bg-white text-[#8b9aaa] hover:text-[#1084a2] shadow-sm rounded-lg border border-[#f0ebe0]"
                      title="Edit"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(social.id, social.platform)}
                      className="p-1.5 bg-white text-[#8b9aaa] hover:text-red-500 shadow-sm rounded-lg border border-[#f0ebe0]"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 mb-3 rounded-xl bg-white border border-[#f0ebe0] shadow-sm flex items-center justify-center p-2.5">
                    {social.icon_url ? (
                      <img src={social.icon_url} alt={social.platform} className="w-full h-full object-contain" />
                    ) : (
                      <LinkIcon size={24} className="text-[#c4bdb0]" />
                    )}
                  </div>

                  {/* Text */}
                  <h3 className="text-sm font-bold text-[#1a1a1a] text-center mb-1 line-clamp-1">{social.platform}</h3>
                  <a 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] font-medium text-[#1084a2] hover:underline line-clamp-1 break-all"
                  >
                    View Profile
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
