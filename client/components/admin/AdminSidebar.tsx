'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Settings, Users, LogOut, Globe, ChevronRight, Shield } from 'lucide-react';
import { logoutAction } from '@/lib/admin/actions/auth.actions';

const NAV = [
  { href: '/admin',          label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/settings', label: 'Settings',  icon: Settings },
  { href: '/admin/admins',   label: 'Admins',    icon: Users },
  { href: '/admin/profile',  label: 'Profile',   icon: Shield },
];

export default function AdminSidebar({ adminName, adminRole }: { adminName: string; adminRole: string }) {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-[260px] min-h-screen bg-card border-r border-border flex flex-col sticky top-0 h-screen overflow-y-auto shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 p-5 border-b border-border">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ background: 'var(--accent)', fontFamily: 'Calistoga, serif' }}>
          AJ
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground leading-tight">Admin Panel</p>
          <p className="text-xs text-muted-foreground">Alen James</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2 mb-2 mt-1">
          Navigation
        </p>
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                active
                  ? 'font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              style={active ? { background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: 'var(--accent)' } : {}}
            >
              <Icon size={16} />
              <span>{label}</span>
              {active && <ChevronRight size={12} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border flex flex-col gap-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <Globe size={15} />
          <span>View Site</span>
        </a>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </form>
        <div className="flex items-center gap-2.5 px-3 py-2.5 mt-1 bg-muted rounded-lg">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ background: 'var(--accent)' }}
          >
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{adminName}</p>
            <p className="text-xs text-muted-foreground capitalize">{adminRole}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
