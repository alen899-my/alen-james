'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Pencil, X, Loader2, Tag, ChevronRight } from 'lucide-react';
import { createWorkCategoryAction, updateWorkCategoryAction } from '@/lib/admin/actions/work_categories.actions';
import { WorkCategory } from '@/lib/admin/models/work_categories.model';
import { motion, AnimatePresence } from 'framer-motion';

interface CategoryFormModalProps {
  category?: WorkCategory;
}

export default function CategoryFormModal({ category }: CategoryFormModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = category 
      ? await updateWorkCategoryAction(category.id, formData)
      : await createWorkCategoryAction(null, formData);
    
    setIsSubmitting(false);
    if (res.success) {
      setIsOpen(false);
    } else {
      setError(res.error || 'Something went wrong.');
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl border border-[#e8e2d5] shadow-2xl overflow-hidden pointer-events-auto"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0ebe0]" style={{ background: 'linear-gradient(to bottom, #fdf9f2, #f7f2e8)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#1084a2] to-[#1a9bbf] text-white">
                  <Tag size={15} />
                </div>
                <h2 className="text-sm font-bold text-[#1a1a1a]">{category ? 'Edit Category' : 'New Category'}</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-[#8b9aaa] hover:bg-[#faf7f0] hover:text-[#1a1a1a] transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600 font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#8b9aaa] ml-1">Category Name</label>
                <input
                  name="name"
                  type="text"
                  defaultValue={category?.name || ''}
                  required
                  placeholder="e.g. Animated, CMS, 3D"
                  className="w-full px-4 py-2.5 bg-[#fdfbf7] border border-[#e8e2d5] rounded-xl text-sm text-[#1a1a1a] focus:outline-none focus:border-[#1084a2] focus:ring-2 focus:ring-[#1084a2]/10 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#8b9aaa] ml-1">Slug</label>
                <input
                  name="slug"
                  type="text"
                  defaultValue={category?.slug || ''}
                  required
                  placeholder="e.g. animated"
                  className="w-full px-4 py-2.5 bg-[#fdfbf7] border border-[#e8e2d5] rounded-xl text-sm text-[#1a1a1a] focus:outline-none focus:border-[#1084a2] focus:ring-2 focus:ring-[#1084a2]/10 transition-all font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8b9aaa] hover:bg-[#faf7f0] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm disabled:opacity-50 transition-all"
                  style={{ background: 'linear-gradient(135deg, #1084a2, #1a9bbf)' }}
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : (category ? 'Update' : 'Create')}
                  <ChevronRight size={14} />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {category ? (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg text-[#8b9aaa] hover:bg-[#faf7f0] hover:text-[#1a1a1a] transition-colors"
          title="Edit Category"
        >
          <Pencil size={16} />
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:shadow-md active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #1084a2, #1a9bbf)' }}
        >
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      )}

      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}


