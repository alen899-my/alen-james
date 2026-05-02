import { ReactNode } from 'react';

interface Props {
  title?: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export default function AdminCard({ title, description, children, actions, className = '' }: Props) {
  return (
    <div className={`bg-card border border-border rounded-xl overflow-hidden ${className}`}>
      {(title || actions) && (
        <div className="flex items-start justify-between px-6 py-4 border-b border-border gap-4">
          <div className="min-w-0">
            {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
