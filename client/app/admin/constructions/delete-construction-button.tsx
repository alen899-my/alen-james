'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteConstructionAction } from '@/lib/admin/actions/constructions.actions';
import { useRouter } from 'next/navigation';

export default function DeleteConstructionButton({ id, name }: { id: number; name: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setLoading(true);
    const res = await deleteConstructionAction(id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || 'Failed to delete.');
      setLoading(false);
    }
  };

  return (
    <button onClick={handleDelete} disabled={loading}
      className="p-2 text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Delete">
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  );
}
