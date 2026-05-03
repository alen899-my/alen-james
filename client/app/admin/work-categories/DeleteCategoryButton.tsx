'use client';

import { deleteWorkCategoryAction } from '@/lib/admin/actions/work_categories.actions';
import { Trash2 } from 'lucide-react';

export default function DeleteCategoryButton({ id }: { id: number }) {
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this category? Works in this category will be uncategorized.')) return;
    const res = await deleteWorkCategoryAction(id);
    if (!res.success) alert(res.error);
  };

  return (
    <button
      onClick={handleDelete}
      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
      title="Delete Category"
    >
      <Trash2 size={16} />
    </button>
  );
}
