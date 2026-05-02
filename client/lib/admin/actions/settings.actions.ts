'use server';

import { getAdminSession } from '@/lib/auth';
import { getSettings, updateSettings } from '@/lib/admin/models/settings.model';
import { revalidatePath } from 'next/cache';

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function updateSettingsAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const fields: Record<string, string | boolean> = {
    site_name: (formData.get('site_name') as string)?.trim() || 'Alen James',
    site_description: (formData.get('site_description') as string)?.trim() || '',
    site_tagline: (formData.get('site_tagline') as string)?.trim() || '',
    site_url: (formData.get('site_url') as string)?.trim() || '',
    contact_email: (formData.get('contact_email') as string)?.trim() || '',
    meta_keywords: (formData.get('meta_keywords') as string)?.trim() || '',
    logo_type: (formData.get('logo_type') as string) || 'text',
    logo_text: (formData.get('logo_text') as string)?.trim() || '',
    color_primary: (formData.get('color_primary') as string) || '#1084a2',
    color_accent: (formData.get('color_accent') as string) || '#1084a2',
    color_background: (formData.get('color_background') as string) || '#fdf8e1',
    color_text: (formData.get('color_text') as string) || '#2d2a21',
    social_github: (formData.get('social_github') as string)?.trim() || '',
    social_linkedin: (formData.get('social_linkedin') as string)?.trim() || '',
    social_instagram: (formData.get('social_instagram') as string)?.trim() || '',
    social_twitter: (formData.get('social_twitter') as string)?.trim() || '',
    maintenance_mode: formData.get('maintenance_mode') === 'on',
    maintenance_message: (formData.get('maintenance_message') as string)?.trim() || "We'll be back soon!",
  };

  await updateSettings(fields);
  revalidatePath('/admin/settings');
  return { success: true, message: 'Settings saved successfully.' };
}
