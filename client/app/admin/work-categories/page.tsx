import { getAllWorkCategories } from '@/lib/admin/models/work_categories.model';
import Link from 'next/link';
import { Plus, Tag, Pencil, Trash2 } from 'lucide-react';
import CategoryFormModal from '@/components/admin/works/CategoryFormModal';
import DeleteCategoryButton from './DeleteCategoryButton';

export const metadata = { title: 'Work Categories — Admin' };

export default async function WorkCategoriesPage() {
  const categories = await getAllWorkCategories();

  return (
    <div>
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5] flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-20">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a]">Work Categories</h1>
          <p className="text-sm text-[#8b9aaa] mt-0.5">Manage groups for your portfolio projects.</p>
        </div>
        <CategoryFormModal />
      </div>

      <div className="p-8">
        <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fdfbf7] border-b border-[#f0ebe0]">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-[#8b9aaa]">Category Name</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-[#8b9aaa]">Slug</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-[#8b9aaa] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ebe0]">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-[#b5af9f]">
                      <Tag size={32} strokeWidth={1.5} />
                      <p className="text-sm font-medium">No categories found.</p>
                      <p className="text-xs">Create your first category to organize your work.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#faf7f0] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#1084a2]/5 flex items-center justify-center text-[#1084a2]">
                          <Tag size={14} />
                        </div>
                        <span className="text-sm font-semibold text-[#1a1a1a]">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#8b9aaa] font-mono">{cat.slug}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <CategoryFormModal category={cat} />
                        <DeleteCategoryButton id={cat.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
