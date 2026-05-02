'use client';

import { useState } from 'react';
import { Trash } from 'lucide-react';
import { deleteWorkAction } from '@/lib/admin/actions/works.actions';
import { useRouter } from 'next/navigation';

export default function DeleteWorkButton({ id, title }: { id: number; title: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete the work "${title}"?`)) return;
    
    setIsDeleting(true);
    const res = await deleteWorkAction(id);
    setIsDeleting(false);
    
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || 'Failed to delete work');
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-[#8b9aaa] hover:text-[#e05454] hover:bg-[#e05454]/10 rounded-lg transition-colors disabled:opacity-50"
      title="Delete"
    >
      <Trash size={16} />
    </button>
  );
}
