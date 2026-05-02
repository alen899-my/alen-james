'use client';

import { PanelLeftClose, PanelLeftOpen, Menu } from 'lucide-react';

interface AppHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
  onMobileOpen: () => void;
  pageTitle?: string;
}

export default function AppHeader({
  collapsed,
  onToggle,
  onMobileOpen,
  pageTitle = 'Dashboard',
}: AppHeaderProps) {
  return (
    <header
      className="w-full flex items-center gap-3 px-4 shrink-0"
      style={{
        height: '60px',
        background: '#faf7f0',
        borderBottom: '1px solid #e8e2d5',
      }}
    >
      {/* ── Desktop toggle button (square) ── */}
      <button
        className="hidden lg:flex items-center justify-center rounded-xl transition-all duration-200 hover:bg-[#ede9de] active:scale-95 shrink-0"
        style={{
          width: '36px',
          height: '36px',
          background: '#ffffff',
          color: '#3d4852',
          border: '1px solid #e8e2d5',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
      </button>

      {/* ── Mobile hamburger (square) ── */}
      <button
        className="lg:hidden flex items-center justify-center rounded-xl transition-all duration-200 hover:bg-[#ede9de] active:scale-95 shrink-0"
        style={{
          width: '36px',
          height: '36px',
          background: '#ffffff',
          color: '#3d4852',
          border: '1px solid #e8e2d5',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
        onClick={onMobileOpen}
        aria-label="Open menu"
      >
        <Menu size={16} />
      </button>

      {/* ── Divider ── */}
      <div
        className="shrink-0"
        style={{ width: '1px', height: '24px', background: '#e8e2d5' }}
      />

      {/* ── Page title ── */}
      <h1
        className="text-base font-semibold tracking-tight truncate"
        style={{ color: '#1a1a1a', fontFamily: 'Calistoga, serif' }}
      >
        {pageTitle}
      </h1>

      {/* ── Spacer ── */}
      <div className="flex-1" />

    </header>
  );
}
