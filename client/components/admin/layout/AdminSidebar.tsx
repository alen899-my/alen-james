'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, LogOut, Globe,
  ChevronRight, X, Briefcase, BookOpen, Wrench, Notebook, FileText
} from 'lucide-react';
import { logoutAction } from '@/lib/admin/actions/auth.actions';
import { useEffect } from 'react';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/works', label: 'Works', icon: Briefcase, exact: false },
  { href: '/admin/education', label: 'Education', icon: BookOpen, exact: false },
  { href: '/admin/skills', label: 'Skills', icon: Wrench, exact: false },
  { href: '/admin/diaries', label: 'My Diary', icon: Notebook, exact: false },
  { href: '/admin/blogs', label: 'Blogs', icon: FileText, exact: false },
];

interface AdminSidebarProps {
  adminName: string;
  adminRole: string;
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AdminSidebar({
  adminName,
  adminRole,
  collapsed,
  mobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => { onMobileClose(); }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  /* ─── Sidebar inner content ─── */
  const SidebarInner = ({ mini, isMobile }: { mini: boolean; isMobile: boolean }) => (
    <aside
      className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out"
      style={{
        width: mini ? '68px' : '260px',
        background: '#faf7f0',
        borderRight: '1px solid #e8e2d5',
      }}
    >
      {/* ── Brand header ── */}
      <div
        className="flex items-center shrink-0"
        style={{
          height: '60px',
          borderBottom: '1px solid #e8e2d5',
          padding: mini ? '0 14px' : '0 16px',
          justifyContent: mini ? 'center' : undefined,
          gap: mini ? '0' : '12px',
        }}
      >
        {/* Logo */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
          style={{
            background: 'linear-gradient(135deg,#1084a2,#1a9bbf)',
            color: '#fff',
            fontFamily: 'Calistoga,serif',
            boxShadow: '0 4px 14px rgba(16,132,162,.28)',
          }}
        >
          AJ
        </div>

        {/* Brand text */}
        {!mini && (
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="text-sm font-semibold leading-tight truncate" style={{ color: '#1a1a1a' }}>
              Admin Panel
            </p>
            <p className="text-xs truncate" style={{ color: '#8b9aaa' }}>
              Alen James
            </p>
          </div>
        )}

        {/* Mobile close button */}
        {isMobile && (
          <button
            className="shrink-0 ml-auto p-1.5 rounded-lg transition-colors hover:bg-black/5"
            style={{ color: '#8b9aaa' }}
            onClick={onMobileClose}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-2 py-4 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
        {!mini && (
          <p
            className="text-[10px] font-semibold uppercase tracking-widest px-2 mb-2"
            style={{ color: '#aab4be' }}
          >
            Navigation
          </p>
        )}

        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              title={mini ? label : undefined}
              className="flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                padding: mini ? '10px 0' : '10px 12px',
                justifyContent: mini ? 'center' : undefined,
                ...(active
                  ? { background: '#1084a2', color: '#fff', boxShadow: '0 4px 14px rgba(16,132,162,.22)' }
                  : { color: '#3d4852' }),
              }}
              onMouseEnter={e => {
                if (!active) {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = '#fff';
                  el.style.color = '#1084a2';
                  el.style.boxShadow = '0 2px 8px rgba(0,0,0,.06)';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'transparent';
                  el.style.color = '#3d4852';
                  el.style.boxShadow = 'none';
                }
              }}
            >
              <Icon size={16} className="shrink-0" />
              {!mini && <span className="truncate">{label}</span>}
              {!mini && active && <ChevronRight size={12} className="ml-auto opacity-70 shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div
        className="px-2 py-3 flex flex-col gap-1 shrink-0"
        style={{ borderTop: '1px solid #e8e2d5' }}
      >
        {/* View Site */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title={mini ? 'View Site' : undefined}
          className="flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-150"
          style={{
            padding: mini ? '10px 0' : '10px 12px',
            justifyContent: mini ? 'center' : undefined,
            color: '#3d4852',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = '#fff';
            el.style.color = '#1084a2';
            el.style.boxShadow = '0 2px 8px rgba(0,0,0,.06)';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = 'transparent';
            el.style.color = '#3d4852';
            el.style.boxShadow = 'none';
          }}
        >
          <Globe size={15} className="shrink-0" />
          {!mini && <span>View Site</span>}
        </a>

        {/* Logout */}
        <form action={logoutAction}>
          <button
            type="submit"
            title={mini ? 'Logout' : undefined}
            className="w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-150"
            style={{
              padding: mini ? '10px 0' : '10px 12px',
              justifyContent: mini ? 'center' : undefined,
              color: '#e05454',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fff0f0'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <LogOut size={15} className="shrink-0" />
            {!mini && <span>Logout</span>}
          </button>
        </form>

      </div>
    </aside>
  );

  return (
    <>
      {/* ── DESKTOP: collapsible sticky sidebar ── */}
      <div className="hidden lg:flex sticky top-0 h-screen">
        <SidebarInner mini={collapsed} isMobile={false} />
      </div>

      {/* ── MOBILE: backdrop ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(2px)' }}
          onClick={onMobileClose}
        />
      )}

      {/* ── MOBILE: sliding drawer ── */}
      <div
        className="lg:hidden fixed top-0 left-0 z-50 h-full"
        style={{
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <SidebarInner mini={false} isMobile={true} />
      </div>
    </>
  );
}
