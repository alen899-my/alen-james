'use client';

import { useActionState } from 'react';
import { updateSettingsAction } from '@/lib/admin/actions/settings.actions';
import AdminCard from '@/components/admin/AdminCard';
import AdminButton from '@/components/admin/AdminButton';
import { AdminInput, AdminTextarea, AdminSelect, AdminColorField } from '@/components/admin/AdminFields';
import { Save } from 'lucide-react';
import type { SiteSettings } from '@/lib/admin/models/settings.model';

export default function SettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [state, action, pending] = useActionState(updateSettingsAction, null);

  return (
    <form action={action} className="space-y-6">
      {state?.message && (
        <div className="px-4 py-3 rounded-lg bg-green-400/10 border border-green-400/20 text-green-400 text-sm font-medium">
          ✓ {state.message}
        </div>
      )}
      {state?.error && (
        <div className="px-4 py-3 rounded-lg bg-red-400/10 border border-red-400/20 text-red-400 text-sm font-medium">
          {state.error}
        </div>
      )}

      <AdminCard title="General" description="Basic site information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminInput label="Site Name" name="site_name" defaultValue={settings?.site_name ?? ''} required />
          <AdminInput label="Contact Email" name="contact_email" type="email" defaultValue={settings?.contact_email ?? ''} />
          <AdminInput label="Site URL" name="site_url" type="url" defaultValue={settings?.site_url ?? ''} placeholder="https://alenjames.com" />
          <AdminInput label="Tagline" name="site_tagline" defaultValue={settings?.site_tagline ?? ''} />
          <div className="sm:col-span-2">
            <AdminTextarea label="Description" name="site_description" defaultValue={settings?.site_description ?? ''} placeholder="Short description of your site..." />
          </div>
          <div className="sm:col-span-2">
            <AdminInput label="Meta Keywords" name="meta_keywords" defaultValue={settings?.meta_keywords ?? ''} placeholder="portfolio, developer, designer" />
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Logo" description="Logo type and text settings">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminSelect
            label="Logo Type"
            name="logo_type"
            defaultValue={settings?.logo_type ?? 'text'}
            options={[{ value: 'text', label: 'Text Logo' }, { value: 'image', label: 'Image Logo' }]}
          />
          <AdminInput label="Logo Text" name="logo_text" defaultValue={settings?.logo_text ?? 'Alen James'} />
          <AdminInput label="Logo Image URL" name="logo_image_url" defaultValue={settings?.logo_image_url ?? ''} placeholder="https://..." />
        </div>
      </AdminCard>

      <AdminCard title="Colors" description="Brand color palette">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminColorField label="Primary Color"    name="color_primary"    defaultValue={settings?.color_primary ?? '#1084a2'} />
          <AdminColorField label="Accent Color"     name="color_accent"     defaultValue={settings?.color_accent ?? '#1084a2'} />
          <AdminColorField label="Background Color" name="color_background" defaultValue={settings?.color_background ?? '#fdf8e1'} />
          <AdminColorField label="Text Color"       name="color_text"       defaultValue={settings?.color_text ?? '#2d2a21'} />
        </div>
      </AdminCard>

      <AdminCard title="Social Links" description="Social media profiles">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminInput label="GitHub"    name="social_github"    defaultValue={settings?.social_github ?? ''}    placeholder="https://github.com/username" />
          <AdminInput label="LinkedIn"  name="social_linkedin"  defaultValue={settings?.social_linkedin ?? ''}  placeholder="https://linkedin.com/in/username" />
          <AdminInput label="Instagram" name="social_instagram" defaultValue={settings?.social_instagram ?? ''} placeholder="https://instagram.com/username" />
          <AdminInput label="Twitter/X" name="social_twitter"   defaultValue={settings?.social_twitter ?? ''}   placeholder="https://twitter.com/username" />
        </div>
      </AdminCard>

      <AdminCard title="Maintenance" description="Put your site into maintenance mode">
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="maintenance_mode"
              defaultChecked={settings?.maintenance_mode ?? false}
              className="w-4 h-4 accent-[var(--accent)] rounded"
            />
            <span className="text-sm font-medium text-foreground group-hover:text-[var(--accent)] transition-colors">
              Enable Maintenance Mode
            </span>
          </label>
          <AdminTextarea
            label="Maintenance Message"
            name="maintenance_message"
            defaultValue={settings?.maintenance_message ?? "We'll be back soon!"}
            rows={3}
          />
        </div>
      </AdminCard>

      <div className="flex justify-end">
        <AdminButton type="submit" loading={pending} icon={<Save size={15} />} size="lg">
          Save Settings
        </AdminButton>
      </div>
    </form>
  );
}
