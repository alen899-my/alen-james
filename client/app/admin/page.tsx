import { getAdminSession } from '@/lib/auth';
import { getAllAdmins } from '@/lib/admin/models/admin.model';
import { getSettings } from '@/lib/admin/models/settings.model';
import StatCard from '@/components/admin/StatCard';
import AdminCard from '@/components/admin/AdminCard';
import AdminBadge from '@/components/admin/AdminBadge';
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
    <div>
      {/* Page Header */}
      <div className="px-8 pt-7 pb-5 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Welcome back, <span className="font-semibold text-foreground">{session?.name}</span>
        </p>
      </div>

      <div className="p-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Admins"
            value={admins.length}
            subtitle={`${activeAdmins} active`}
            icon={<Users size={18} />}
            trend="neutral"
          />
          <StatCard
            title="Active Admins"
            value={activeAdmins}
            icon={<Activity size={18} />}
            accent="var(--chart-2)"
            trend="up"
          />
          <StatCard
            title="Site Status"
            value={settings?.maintenance_mode ? 'Maintenance' : 'Live'}
            subtitle={settings?.site_name ?? 'Alen James'}
            icon={settings?.maintenance_mode ? <Clock size={18} /> : <Globe size={18} />}
            accent={settings?.maintenance_mode ? '#f59e0b' : '#22c55e'}
          />
          <StatCard
            title="Settings"
            value="Active"
            subtitle="All systems go"
            icon={<CheckCircle size={18} />}
            accent="#22c55e"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Info */}
          <AdminCard title="Your Session" description="Current login information">
            <dl className="space-y-3">
              {[
                { label: 'Name',       value: session?.name },
                { label: 'Email',      value: session?.email },
                { label: 'Role',       value: <AdminBadge label={session?.role ?? 'admin'} variant={session?.role as any} /> },
                { label: 'Last Login', value: fmt(lastLogin ?? null) },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="text-sm font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </AdminCard>

          {/* Recent admins */}
          <AdminCard title="Admin Users" description="Recently added admins">
            <div className="space-y-2">
              {admins.slice(0, 5).map((admin) => (
                <div key={admin.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: 'var(--accent)' }}
                    >
                      {admin.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{admin.name}</p>
                      <p className="text-xs text-muted-foreground">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <AdminBadge label={admin.role} variant={admin.role as any} />
                    <AdminBadge label={admin.is_active ? 'Active' : 'Inactive'} variant={admin.is_active ? 'active' : 'inactive'} />
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        {/* Site Settings Quick View */}
        {settings && (
          <AdminCard title="Site Settings" description="Current site configuration at a glance">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Site Name',    value: settings.site_name },
                { label: 'Contact',      value: settings.contact_email ?? '—' },
                { label: 'Site URL',     value: settings.site_url ?? '—' },
                { label: 'Maintenance',  value: settings.maintenance_mode ? 'ON' : 'OFF' },
                { label: 'Logo Type',    value: settings.logo_type },
                { label: 'GitHub',       value: settings.social_github ? '✓ Set' : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">{label}</p>
                  <p className="text-sm font-semibold text-foreground truncate">{value}</p>
                </div>
              ))}
            </div>
          </AdminCard>
        )}
      </div>
    </div>
  );
}
