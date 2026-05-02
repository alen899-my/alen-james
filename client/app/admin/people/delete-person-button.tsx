'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deletePersonAction } from '@/lib/admin/actions/people.actions';

export default function DeletePersonButton({ id, name }: { id: number; name: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete the profile for "${name}"?`)) {
      startTransition(async () => {
        const res = await deletePersonAction(id);
        if (!res.success) {
          alert(res.error || 'Failed to delete person profile.');
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
