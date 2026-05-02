import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary:   'text-white hover:opacity-90',
  secondary: 'bg-muted text-foreground border border-border hover:border-[var(--accent)]/50',
  danger:    'bg-red-400/10 text-red-400 hover:bg-red-400/20',
  ghost:     'text-muted-foreground hover:bg-muted hover:text-foreground',
};
const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-2.5 text-base gap-2.5',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
}

export default function AdminButton({
  children, variant = 'primary', size = 'md', loading = false,
  icon, className = '', disabled, ...props
}: Props) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-semibold rounded-lg transition-all ${variants[variant]} ${sizes[size]} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={variant === 'primary' ? { background: 'var(--accent)' } : undefined}
    >
      {loading
        ? <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
        : icon && <span className="flex shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
