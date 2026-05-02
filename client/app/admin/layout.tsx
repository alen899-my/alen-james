import { getAdminSession } from '@/lib/auth';
import AdminShell from '@/components/admin/layout/AdminShell';

export const metadata = { title: 'Admin — Alen James' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  // No session = login page — render without shell to avoid redirect loop
  if (!session) {
    return <>{children}</>;
  }

  return (
    <AdminShell adminName={session.name} adminRole={session.role}>
      {children}
    </AdminShell>
  );
}
