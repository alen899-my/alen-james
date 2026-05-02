'use client';

import { useActionState } from 'react';
import { updateProfileAction, changePasswordAction } from '@/lib/admin/actions/auth.actions';
import AdminCard from '@/components/admin/AdminCard';
import AdminButton from '@/components/admin/AdminButton';
import { AdminInput } from '@/components/admin/AdminFields';
import { Save, Lock } from 'lucide-react';
import type { AdminSessionPayload } from '@/lib/auth';

function Alert({ type, msg }: { type: 'success' | 'error'; msg: string }) {
  const cls = type === 'success'
    ? 'bg-green-400/10 border-green-400/20 text-green-400'
    : 'bg-red-400/10 border-red-400/20 text-red-400';
  return (
    <div className={`mb-4 px-4 py-3 rounded-lg border text-sm font-medium ${cls}`}>
      {type === 'success' ? '✓ ' : ''}{msg}
    </div>
  );
}

export default function ProfileForms({ session }: { session: AdminSessionPayload }) {
  const [profileState, profileAction, profilePending] = useActionState(updateProfileAction, null);
  const [pwState, pwAction, pwPending] = useActionState(changePasswordAction, null);

  return (
    <div className="space-y-6">
      {/* Profile Info */}
      <AdminCard title="Profile" description="Update your name and contact details">
        {profileState?.message && <Alert type="success" msg={profileState.message} />}
        {profileState?.error   && <Alert type="error"   msg={profileState.error}   />}
        <form action={profileAction} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminInput label="Full Name" name="name" defaultValue={session.name} required />
          <AdminInput label="Email" name="email" type="email" defaultValue={session.email} disabled hint="Email cannot be changed" />
          <div className="sm:col-span-2 flex justify-end">
            <AdminButton type="submit" loading={profilePending} icon={<Save size={15} />}>
              Save Profile
            </AdminButton>
          </div>
        </form>
      </AdminCard>

      {/* Change Password */}
      <AdminCard title="Change Password" description="Choose a strong password (min. 6 characters)">
        {pwState?.message && <Alert type="success" msg={pwState.message} />}
        {pwState?.error   && <Alert type="error"   msg={pwState.error}   />}
        <form action={pwAction} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <AdminInput label="Current Password" name="current_password" type="password" required placeholder="••••••••" />
          </div>
          <AdminInput label="New Password"     name="new_password"     type="password" required placeholder="••••••••" />
          <AdminInput label="Confirm Password" name="confirm_password" type="password" required placeholder="••••••••" />
          <div className="sm:col-span-2 flex justify-end">
            <AdminButton type="submit" loading={pwPending} icon={<Lock size={15} />} variant="secondary">
              Change Password
            </AdminButton>
          </div>
        </form>
      </AdminCard>

      {/* Account Info */}
      <AdminCard title="Account Information" description="Read-only details about your account">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Email',  value: session.email },
            { label: 'Role',   value: session.role  },
            { label: 'Status', value: 'Active'       },
          ].map(({ label, value }) => (
            <div key={label} className="bg-muted/40 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className="text-sm font-semibold text-foreground capitalize">{value}</p>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
