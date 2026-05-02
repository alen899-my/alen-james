import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProfileForms from './ProfileForms';

export const metadata = { title: 'Profile — Admin' };

export default async function ProfilePage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  return (
    <div>
      <div className="px-8 pt-7 pb-5 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">Your Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account details and password</p>
      </div>
      <div className="p-8">
        <ProfileForms session={session} />
      </div>
    </div>
  );
}
