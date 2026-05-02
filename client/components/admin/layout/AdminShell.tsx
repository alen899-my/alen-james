'use client';

import { useState, useCallback } from 'react';
import AdminSidebar from './AdminSidebar';
import AppHeader from './AppHeader';

interface AdminShellProps {
  adminName: string;
  adminRole: string;
  children: React.ReactNode;
}

export default function AdminShell({ adminName, adminRole, children }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileClose = useCallback(() => setMobileOpen(false), []);
  const handleMobileOpen  = useCallback(() => setMobileOpen(true),  []);
  const handleToggle      = useCallback(() => setCollapsed(v => !v), []);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: '#faf7f0', color: '#1a1a1a' }}
    >
      {/* Sidebar — fixed height, no scroll of its own on desktop */}
      <AdminSidebar
        adminName={adminName}
        adminRole={adminRole}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={handleMobileClose}
      />

      {/* Right column — fills remaining space, header fixed + content scrolls */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* AppHeader: never moves */}
        <AppHeader
          collapsed={collapsed}
          onToggle={handleToggle}
          onMobileOpen={handleMobileOpen}
        />

        {/* Page content: only this scrolls */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
