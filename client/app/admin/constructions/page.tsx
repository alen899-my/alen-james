import { getAllConstructions, Construction } from '@/lib/admin/models/constructions.model';
import Link from 'next/link';
import { HardHat, Plus, Pencil } from 'lucide-react';
import DeleteConstructionButton from './delete-construction-button';
import AdminTable from '@/components/admin/common/AdminTable';

export const metadata = { title: 'Under Construction — Admin' };

const PHASE_COLORS: Record<string, string> = {
  Planning:    '#8b9aaa',
  Design:      '#a855f7',
  Development: '#1084a2',
  Testing:     '#f59e0b',
  Beta:        '#10b981',
  'Almost Done': '#22c55e',
};

export default async function ConstructionsPage() {
  const items = await getAllConstructions();

  const columns = [
    {
      header: 'Project',
      key: 'name',
      render: (c: Construction) => (
        <div className="flex items-center gap-4">
          {c.main_image ? (
            <img src={c.main_image} alt={c.name}
              className="w-12 h-12 rounded-lg object-cover border border-[var(--border)]" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)]">
              <HardHat size={20} />
            </div>
          )}
          <div>
            <p className="font-medium text-[var(--foreground)]">{c.name}</p>
            {c.tagline && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{c.tagline}</p>}
          </div>
        </div>
      )
    },
    {
      header: 'Phase',
      key: 'construction_phase',
      render: (c: Construction) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-white"
          style={{ background: PHASE_COLORS[c.construction_phase || ''] || '#8b9aaa' }}>
          {c.construction_phase || 'Planning'}
        </span>
      )
    },
    {
      header: 'Type',
      key: 'is_upcoming',
      render: (c: Construction) => (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
          c.is_upcoming
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-blue-50 text-blue-700 border-blue-200'
        }`}>
          {c.is_upcoming ? '⏳ Upcoming' : '🔨 Building'}
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (c: Construction) => (
        <span className={`text-xs font-semibold ${c.status === 'active' ? 'text-emerald-600' : 'text-[var(--muted-foreground)]'}`}>
          {c.status === 'active' ? '● Active' : '○ Inactive'}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (c: Construction) => (
        <div className="flex items-center justify-end gap-2">
          <Link href={`/admin/constructions/${c.id}`}
            className="p-2 text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded-lg transition-colors" title="Edit">
            <Pencil size={16} />
          </Link>
          <DeleteConstructionButton id={c.id} name={c.name} />
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="px-8 pt-7 pb-5 border-b border-[var(--border)] flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Under Construction</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">Current builds and upcoming projects</p>
        </div>
        <Link href="/admin/constructions/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#1084a2] text-white rounded-xl text-sm font-medium hover:bg-[#1a9bbf] transition-colors shadow-sm">
          <Plus size={16} /> Add Project
        </Link>
      </div>
      <div className="p-8">
        <AdminTable columns={columns} data={items} keyField="id"
          emptyMessage="No construction projects added yet."
          emptyIcon={<HardHat size={40} />} />
      </div>
    </div>
  );
}
