import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  accent?: string; // CSS color string
}

export default function StatCard({ title, value, subtitle, icon, trend, accent }: Props) {
  const a = accent ?? 'var(--accent)';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendCls = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-muted-foreground';

  return (
    <div className="bg-card border border-border rounded-xl p-5 transition-colors hover:border-[var(--accent)]/40 group">
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `color-mix(in srgb, ${a} 12%, transparent)`, color: a }}
        >
          {icon}
        </div>
        {trend && <TrendIcon size={14} className={trendCls} />}
      </div>
      <p className="text-3xl font-bold text-foreground leading-none">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground/70 mt-0.5">{subtitle}</p>}
    </div>
  );
}
