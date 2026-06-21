'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deleteWhatsNewAction } from '@/lib/admin/actions/whats_new.actions';

export default function DeleteWhatsNewButton({ id, title }: { id: number; title: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete the announcement "${title}"?`)) {
      startTransition(async () => {
        const res = await deleteWhatsNewAction(id);
        if (!res.success) {
          alert(res.error || 'Failed to delete announcement.');
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
