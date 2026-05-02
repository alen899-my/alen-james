'use server';

import { getAdminSession } from '@/lib/auth';
import {
  createDiary,
  updateDiary,
  deleteDiary,
  DiaryInput,
} from '@/lib/admin/models/diaries.model';
import { revalidatePath } from 'next/cache';

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function createDiaryAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const title = (formData.get('title') as string)?.trim();
  if (!title) {
    return { success: false, error: 'Diary title is required.' };
  }

  const imagesData = formData.get('images') as string;
  
  // Convert boolean checkbox string 'on' to boolean
  const isPublicRaw = formData.get('is_public');
  const is_public = isPublicRaw === 'true' || isPublicRaw === 'on';

  const input: DiaryInput = {
    title,
    content: (formData.get('content') as string)?.trim() || null,
    images: imagesData ? JSON.parse(imagesData) : [],
    is_public,
    password: (formData.get('password') as string)?.trim() || null,
    incident_date: (formData.get('incident_date') as string)?.trim() || null,
  };

  try {
    await createDiary(input);
    revalidatePath('/admin/diaries');
    return { success: true, message: `Diary entry created successfully.` };
  } catch (err: any) {
    console.error('Create Diary Error:', err);
    return { success: false, error: 'Failed to create diary entry.' };
  }
}

export async function updateDiaryAction(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const title = (formData.get('title') as string)?.trim();
  if (!title) {
    return { success: false, error: 'Diary title is required.' };
  }

  const imagesData = formData.get('images') as string;
  
  const isPublicRaw = formData.get('is_public');
  const is_public = isPublicRaw === 'true' || isPublicRaw === 'on';

  const input: Partial<DiaryInput> = {
    title,
    content: (formData.get('content') as string)?.trim() || null,
    images: imagesData ? JSON.parse(imagesData) : [],
    is_public,
    password: (formData.get('password') as string)?.trim() || null,
    incident_date: (formData.get('incident_date') as string)?.trim() || null,
  };

  try {
    await updateDiary(id, input);
    revalidatePath('/admin/diaries');
    return { success: true, message: `Diary entry updated successfully.` };
  } catch (err: any) {
    console.error('Update Diary Error:', err);
    return { success: false, error: 'Failed to update diary entry.' };
  }
}

export async function deleteDiaryAction(id: number): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  try {
    await deleteDiary(id);
    revalidatePath('/admin/diaries');
    return { success: true, message: 'Diary entry deleted successfully.' };
  } catch (err: any) {
    console.error('Delete Diary Error:', err);
    return { success: false, error: 'Failed to delete diary entry.' };
  }
}

import { updateSettings } from '@/lib/admin/models/settings.model';

export async function updateGlobalDiaryPasswordAction(password: string): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  try {
    await updateSettings({ diary_global_password: password || null });
    revalidatePath('/admin/diaries');
    return { success: true, message: 'Global diary password updated.' };
  } catch (err: any) {
    console.error('Update Global Password Error:', err);
    return { success: false, error: 'Failed to update global password.' };
  }
}
