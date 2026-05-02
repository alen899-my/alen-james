'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deleteExperienceAction } from '@/lib/admin/actions/experiences.actions';

export default function DeleteExperienceButton({ id, job_title }: { id: number; job_title: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete the experience "${job_title}"?`)) {
      startTransition(async () => {
        const res = await deleteExperienceAction(id);
        if (!res.success) {
          alert(res.error || 'Failed to delete experience.');
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
