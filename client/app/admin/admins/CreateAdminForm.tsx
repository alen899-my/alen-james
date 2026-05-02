'use client';

import { useActionState } from 'react';
import { createAdminAction } from '@/lib/admin/actions/admins.actions';
import AdminCard from '@/components/admin/AdminCard';
import AdminButton from '@/components/admin/AdminButton';
import { AdminInput, AdminSelect } from '@/components/admin/AdminFields';
import { UserPlus } from 'lucide-react';

export default function CreateAdminForm() {
  const [state, action, pending] = useActionState(createAdminAction, null);

  return (
    <AdminCard
      title="Create New Admin"
      description="Add a new admin user. Only superadmins can do this."
    >
      {state?.message && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-green-400/10 border border-green-400/20 text-green-400 text-sm font-medium">
          ✓ {state.message}
        </div>
      )}
      {state?.error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-400/10 border border-red-400/20 text-red-400 text-sm font-medium">
          {state.error}
        </div>
      )}

      <form action={action} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AdminInput label="Full Name" name="name" required placeholder="John Doe" />
        <AdminInput label="Email" name="email" type="email" required placeholder="john@example.com" />
        <AdminInput label="Password" name="password" type="password" required placeholder="Min. 6 characters" />
        <AdminSelect
          label="Role"
          name="role"
          defaultValue="admin"
          options={[
            { value: 'admin', label: 'Admin' },
            { value: 'superadmin', label: 'Super Admin' },
          ]}
        />
        <div className="sm:col-span-2 flex justify-end">
          <AdminButton type="submit" loading={pending} icon={<UserPlus size={15} />}>
            Create Admin
          </AdminButton>
        </div>
      </form>
    </AdminCard>
  );
}
