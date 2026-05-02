import { getAdminSession } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = { title: 'Admin — Alen James' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  // No session = this is the login page (middleware already guards everything else).
  // Render children without the shell to avoid a redirect loop.
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="dark flex min-h-screen bg-background text-foreground">
      <AdminSidebar adminName={session.name} adminRole={session.role} />
      <main className="flex-1 min-w-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
