import { getAllWorkCategories } from '@/lib/admin/models/work_categories.model';
import Link from 'next/link';
import { Plus, Tag, Pencil, Trash2 } from 'lucide-react';
import CategoryFormModal from '@/components/admin/works/CategoryFormModal';
import DeleteCategoryButton from './DeleteCategoryButton';
import AdminTable from '@/components/admin/common/AdminTable';

export const metadata = { title: 'Work Categories — Admin' };

export default async function WorkCategoriesPage() {
  const categories = await getAllWorkCategories();

  const columns = [
    {
      header: 'Category Name',
      key: 'name',
      render: (cat: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/5 flex items-center justify-center text-[var(--accent)]">
            <Tag size={14} />
          </div>
          <span className="text-sm font-semibold text-[var(--foreground)]">{cat.name}</span>
        </div>
      )
    },
    {
      header: 'Slug',
      key: 'slug',
      render: (cat: any) => <span className="text-sm text-[var(--muted-foreground)] font-mono">{cat.slug}</span>
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (cat: any) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <CategoryFormModal category={cat} />
          <DeleteCategoryButton id={cat.id} />
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="px-8 pt-7 pb-5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--background)]/50 backdrop-blur-sm sticky top-0 z-20">
        <div>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Work Categories</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">Manage groups for your portfolio projects.</p>
        </div>
        <CategoryFormModal />
      </div>

      <div className="p-8">
        <AdminTable
          columns={columns}
          data={categories}
          keyField="id"
          emptyMessage="No categories found. Create your first category to organize your work."
          emptyIcon={<Tag size={40} />}
        />
      </div>
    </div>
  );
}
