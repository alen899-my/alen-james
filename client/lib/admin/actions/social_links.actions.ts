'use server';

import { getAdminSession } from '@/lib/auth';
import {
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  SocialLinkInput,
} from '@/lib/admin/models/social_links.model';
import { revalidatePath } from 'next/cache';

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function createSocialLinkAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const platform = (formData.get('platform') as string)?.trim();
  const url = (formData.get('url') as string)?.trim();
  
  if (!platform) return { success: false, error: 'Platform name is required.' };
  if (!url) return { success: false, error: 'URL is required.' };

  const input: SocialLinkInput = {
    platform,
    url,
    icon_url: (formData.get('icon_url') as string)?.trim() || null,
  };

  try {
    await createSocialLink(input);
    revalidatePath('/admin/socials');
    return { success: true, message: `Social link created successfully.` };
  } catch (err: any) {
    console.error('Create Social Link Error:', err);
    return { success: false, error: 'Failed to create social link.' };
  }
}

export async function updateSocialLinkAction(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const platform = (formData.get('platform') as string)?.trim();
  const url = (formData.get('url') as string)?.trim();
  
  if (!platform) return { success: false, error: 'Platform name is required.' };
  if (!url) return { success: false, error: 'URL is required.' };

  const input: Partial<SocialLinkInput> = {
    platform,
    url,
    icon_url: (formData.get('icon_url') as string)?.trim() || null,
  };

  try {
    await updateSocialLink(id, input);
    revalidatePath('/admin/socials');
    return { success: true, message: `Social link updated successfully.` };
  } catch (err: any) {
    console.error('Update Social Link Error:', err);
    return { success: false, error: 'Failed to update social link.' };
  }
}

export async function deleteSocialLinkAction(id: number): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  try {
    await deleteSocialLink(id);
    revalidatePath('/admin/socials');
    return { success: true, message: 'Social link deleted successfully.' };
  } catch (err: any) {
    console.error('Delete Social Link Error:', err);
    return { success: false, error: 'Failed to delete social link.' };
  }
}
