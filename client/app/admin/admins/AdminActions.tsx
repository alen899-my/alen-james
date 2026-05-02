'use client';

import { useTransition } from 'react';
import { toggleAdminStatusAction, deleteAdminAction } from '@/lib/admin/actions/admins.actions';
import { Power, Trash2 } from 'lucide-react';

export default function AdminActions({ id, isActive }: { id: number; isActive: boolean }) {
  const [toggling, startToggle] = useTransition();
  const [deleting, startDelete] = useTransition();

  const handleToggle = () => startToggle(async () => { await toggleAdminStatusAction(id, isActive); });
  const handleDelete = () => {
    if (!confirm('Delete this admin? This cannot be undone.')) return;
    startDelete(async () => { await deleteAdminAction(id); });
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={handleToggle}
        disabled={toggling}
        title={isActive ? 'Deactivate' : 'Activate'}
        className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
          isActive ? 'text-amber-400 hover:bg-amber-400/10' : 'text-green-400 hover:bg-green-400/10'
        } disabled:opacity-40`}
      >
        <Power size={14} />
      </button>
      <button
        onClick={handleDelete}
        disabled={deleting}
        title="Delete admin"
        className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-40"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
