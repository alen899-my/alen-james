import { getSettings } from '@/lib/admin/models/settings.model';
import SettingsForm from './SettingsForm';

export const metadata = { title: 'Settings — Admin' };

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <div className="px-8 pt-7 pb-5 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your site configuration</p>
      </div>
      <div className="p-8">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
