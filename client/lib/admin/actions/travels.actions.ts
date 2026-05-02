'use server';

import { getAdminSession } from '@/lib/auth';
import {
  createTravel,
  updateTravel,
  deleteTravel,
  TravelInput,
} from '@/lib/admin/models/travels.model';
import { updateSettings } from '@/lib/admin/models/settings.model';
import { revalidatePath } from 'next/cache';

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function createTravelAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const location = (formData.get('location') as string)?.trim();
  if (!location) {
    return { success: false, error: 'Location is required.' };
  }

  const imagesData = formData.get('images') as string;
  const videosData = formData.get('videos') as string;
  
  const isPublicRaw = formData.get('is_public');
  const is_public = isPublicRaw === 'true' || isPublicRaw === 'on';

  const input: TravelInput = {
    location,
    period: (formData.get('period') as string)?.trim() || null,
    description: (formData.get('description') as string)?.trim() || null,
    images: imagesData ? JSON.parse(imagesData) : [],
    videos: videosData ? JSON.parse(videosData) : [],
    is_public,
    password: (formData.get('password') as string)?.trim() || null,
  };

  try {
    await createTravel(input);
    revalidatePath('/admin/travels');
    return { success: true, message: `Travel log created successfully.` };
  } catch (err: any) {
    console.error('Create Travel Error:', err);
    return { success: false, error: 'Failed to create travel log.' };
  }
}

export async function updateTravelAction(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const location = (formData.get('location') as string)?.trim();
  if (!location) {
    return { success: false, error: 'Location is required.' };
  }

  const imagesData = formData.get('images') as string;
  const videosData = formData.get('videos') as string;
  
  const isPublicRaw = formData.get('is_public');
  const is_public = isPublicRaw === 'true' || isPublicRaw === 'on';

  const input: Partial<TravelInput> = {
    location,
    period: (formData.get('period') as string)?.trim() || null,
    description: (formData.get('description') as string)?.trim() || null,
    images: imagesData ? JSON.parse(imagesData) : [],
    videos: videosData ? JSON.parse(videosData) : [],
    is_public,
    password: (formData.get('password') as string)?.trim() || null,
  };

  try {
    await updateTravel(id, input);
    revalidatePath('/admin/travels');
    return { success: true, message: `Travel log updated successfully.` };
  } catch (err: any) {
    console.error('Update Travel Error:', err);
    return { success: false, error: 'Failed to update travel log.' };
  }
}

export async function deleteTravelAction(id: number): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  try {
    await deleteTravel(id);
    revalidatePath('/admin/travels');
    return { success: true, message: 'Travel log deleted successfully.' };
  } catch (err: any) {
    console.error('Delete Travel Error:', err);
    return { success: false, error: 'Failed to delete travel log.' };
  }
}

export async function updateGlobalTravelPasswordAction(password: string): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  try {
    await updateSettings({ travel_global_password: password || null });
    revalidatePath('/admin/travels');
    return { success: true, message: 'Global travel password updated.' };
  } catch (err: any) {
    console.error('Update Global Password Error:', err);
    return { success: false, error: 'Failed to update global password.' };
  }
}
