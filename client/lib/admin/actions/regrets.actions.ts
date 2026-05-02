'use server';

import { getAdminSession } from '@/lib/auth';
import {
  createRegret,
  updateRegret,
  deleteRegret,
  RegretInput,
} from '@/lib/admin/models/regrets.model';
import { updateSettings } from '@/lib/admin/models/settings.model';
import { revalidatePath } from 'next/cache';

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function createRegretAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const title = (formData.get('title') as string)?.trim();
  if (!title) {
    return { success: false, error: 'Title is required.' };
  }

  const imagesData = formData.get('images') as string;
  const videosData = formData.get('videos') as string;
  
  const isPublicRaw = formData.get('is_public');
  const is_public = isPublicRaw === 'true' || isPublicRaw === 'on';

  const input: RegretInput = {
    title,
    date: (formData.get('date') as string)?.trim() || null,
    description: (formData.get('description') as string)?.trim() || null,
    images: imagesData ? JSON.parse(imagesData) : [],
    videos: videosData ? JSON.parse(videosData) : [],
    is_public,
    password: (formData.get('password') as string)?.trim() || null,
  };

  try {
    await createRegret(input);
    revalidatePath('/admin/regrets');
    return { success: true, message: `Regret log created successfully.` };
  } catch (err: any) {
    console.error('Create Regret Error:', err);
    return { success: false, error: 'Failed to create regret log.' };
  }
}

export async function updateRegretAction(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const title = (formData.get('title') as string)?.trim();
  if (!title) {
    return { success: false, error: 'Title is required.' };
  }

  const imagesData = formData.get('images') as string;
  const videosData = formData.get('videos') as string;
  
  const isPublicRaw = formData.get('is_public');
  const is_public = isPublicRaw === 'true' || isPublicRaw === 'on';

  const input: Partial<RegretInput> = {
    title,
    date: (formData.get('date') as string)?.trim() || null,
    description: (formData.get('description') as string)?.trim() || null,
    images: imagesData ? JSON.parse(imagesData) : [],
    videos: videosData ? JSON.parse(videosData) : [],
    is_public,
    password: (formData.get('password') as string)?.trim() || null,
  };

  try {
    await updateRegret(id, input);
    revalidatePath('/admin/regrets');
    return { success: true, message: `Regret log updated successfully.` };
  } catch (err: any) {
    console.error('Update Regret Error:', err);
    return { success: false, error: 'Failed to update regret log.' };
  }
}

export async function deleteRegretAction(id: number): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  try {
    await deleteRegret(id);
    revalidatePath('/admin/regrets');
    return { success: true, message: 'Regret log deleted successfully.' };
  } catch (err: any) {
    console.error('Delete Regret Error:', err);
    return { success: false, error: 'Failed to delete regret log.' };
  }
}

export async function updateGlobalRegretPasswordAction(password: string): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  try {
    await updateSettings({ regret_global_password: password || null });
    revalidatePath('/admin/regrets');
    return { success: true, message: 'Global regret password updated.' };
  } catch (err: any) {
    console.error('Update Global Password Error:', err);
    return { success: false, error: 'Failed to update global password.' };
  }
}
