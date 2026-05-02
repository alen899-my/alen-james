'use server';

import { getAdminSession } from '@/lib/auth';
import {
  createMediaGallery,
  updateMediaGallery,
  deleteMediaGallery,
  MediaGalleryInput,
} from '@/lib/admin/models/media.model';
import { revalidatePath } from 'next/cache';

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function createMediaAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const title = (formData.get('title') as string)?.trim();
  if (!title) {
    return { success: false, error: 'Media name is required.' };
  }

  const imagesData = formData.get('images') as string;
  const videosData = formData.get('videos') as string;

  const input: MediaGalleryInput = {
    title,
    description: (formData.get('description') as string)?.trim() || null,
    media_date: (formData.get('media_date') as string)?.trim() || null,
    images: imagesData ? JSON.parse(imagesData) : [],
    videos: videosData ? JSON.parse(videosData) : [],
  };

  try {
    await createMediaGallery(input);
    revalidatePath('/admin/media');
    return { success: true, message: `Media gallery entry created successfully.` };
  } catch (err: any) {
    console.error('Create Media Error:', err);
    return { success: false, error: 'Failed to create media entry.' };
  }
}

export async function updateMediaAction(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const title = (formData.get('title') as string)?.trim();
  if (!title) {
    return { success: false, error: 'Media name is required.' };
  }

  const imagesData = formData.get('images') as string;
  const videosData = formData.get('videos') as string;

  const input: Partial<MediaGalleryInput> = {
    title,
    description: (formData.get('description') as string)?.trim() || null,
    media_date: (formData.get('media_date') as string)?.trim() || null,
    images: imagesData ? JSON.parse(imagesData) : [],
    videos: videosData ? JSON.parse(videosData) : [],
  };

  try {
    await updateMediaGallery(id, input);
    revalidatePath('/admin/media');
    return { success: true, message: `Media gallery entry updated successfully.` };
  } catch (err: any) {
    console.error('Update Media Error:', err);
    return { success: false, error: 'Failed to update media entry.' };
  }
}

export async function deleteMediaAction(id: number): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  try {
    await deleteMediaGallery(id);
    revalidatePath('/admin/media');
    return { success: true, message: 'Media entry deleted successfully.' };
  } catch (err: any) {
    console.error('Delete Media Error:', err);
    return { success: false, error: 'Failed to delete media entry.' };
  }
}
