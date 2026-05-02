'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deleteEducationAction } from '@/lib/admin/actions/education.actions';

export default function DeleteEducationButton({ id, name }: { id: number; name: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete the education entry for "${name}"?`)) {
      startTransition(async () => {
        const res = await deleteEducationAction(id);
        if (!res.success) {
          alert(res.error || 'Failed to delete education entry.');
        } else {
          router.refresh();
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-[#8b9aaa] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Delete"
    >
      <Trash2 size={16} />
    </button>
  );
}
