import { getAdminSession } from '@/lib/auth';
import { getAllAdmins } from '@/lib/admin/models/admin.model';
import { getSettings } from '@/lib/admin/models/settings.model';
import StatCard from '@/components/admin/common/StatCard';
import AdminCard from '@/components/admin/common/AdminCard';
import AdminBadge from '@/components/admin/common/AdminBadge';
import { Users, Settings, Globe, Clock, Activity, CheckCircle } from 'lucide-react';

export default async function AdminDashboard() {
  const [session, admins, settings] = await Promise.all([
    getAdminSession(),
    getAllAdmins(),
    getSettings(),
  ]);

  const activeAdmins = admins.filter((a) => a.is_active).length;
  const lastLogin = session?.id
    ? admins.find((a) => a.id === session.id)?.last_login
    : null;

  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Never';

  return (
  <></>
  );
}
