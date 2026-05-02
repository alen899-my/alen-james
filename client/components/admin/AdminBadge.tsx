type Variant = 'active' | 'inactive' | 'superadmin' | 'admin' | 'warning' | 'info';

const cls: Record<Variant, string> = {
  active:     'bg-green-400/10 text-green-400',
  inactive:   'bg-red-400/10 text-red-400',
  superadmin: 'text-[var(--accent)]',
  admin:      'bg-muted text-muted-foreground',
  warning:    'bg-amber-400/10 text-amber-400',
  info:       'text-[var(--accent)]',
};

export default function AdminBadge({ label, variant = 'info' }: { label: string; variant?: Variant }) {
  const isAccent = variant === 'superadmin' || variant === 'info';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${cls[variant]}`}
      style={isAccent ? { background: 'color-mix(in srgb, var(--accent) 12%, transparent)' } : undefined}
    >
      {label}
    </span>
  );
}
