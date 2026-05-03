'use server';

import { getAdminSession } from '@/lib/auth';
import {
  createWork,
  updateWork,
  deleteWork,
  WorkInput,
} from '@/lib/admin/models/works.model';
import { revalidatePath } from 'next/cache';

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function createWorkAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const title = (formData.get('title') as string)?.trim();
  if (!title) {
    return { success: false, error: 'Title is required.' };
  }

  const screenshotsData = formData.get('screenshots') as string;
  const additionalVideosData = formData.get('additional_videos') as string;
  const techStacksData = formData.get('tech_stacks') as string;

  const input: WorkInput = {
    title,
    subtitle: (formData.get('subtitle') as string)?.trim() || null,
    description: (formData.get('description') as string)?.trim() || null,
    main_image: (formData.get('main_image') as string)?.trim() || null,
    screenshots: screenshotsData ? JSON.parse(screenshotsData) : [],
    additional_videos: additionalVideosData ? JSON.parse(additionalVideosData) : [],
    live_link: (formData.get('live_link') as string)?.trim() || null,
    video_url: (formData.get('video_url') as string)?.trim() || null,
    introduction: (formData.get('introduction') as string)?.trim() || null,
    what_i_did: (formData.get('what_i_did') as string)?.trim() || null,
    tech_stacks: techStacksData ? JSON.parse(techStacksData) : [],
    year: (formData.get('year') as string)?.trim() || null,
    category_id: formData.get('category_id') ? Number(formData.get('category_id')) : null,
  };

  try {
    await createWork(input);
    revalidatePath('/admin/works');
    return { success: true, message: `Work "${title}" created successfully.` };
  } catch (err: any) {
    console.error('Create Work Error:', err);
    return { success: false, error: 'Failed to create work.' };
  }
}

export async function updateWorkAction(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const title = (formData.get('title') as string)?.trim();
  if (!title) {
    return { success: false, error: 'Title is required.' };
  }

  const screenshotsData = formData.get('screenshots') as string;
  const additionalVideosData = formData.get('additional_videos') as string;
  const techStacksData = formData.get('tech_stacks') as string;

  const input: Partial<WorkInput> = {
    title,
    subtitle: (formData.get('subtitle') as string)?.trim() || null,
    description: (formData.get('description') as string)?.trim() || null,
    main_image: (formData.get('main_image') as string)?.trim() || null,
    screenshots: screenshotsData ? JSON.parse(screenshotsData) : [],
    additional_videos: additionalVideosData ? JSON.parse(additionalVideosData) : [],
    live_link: (formData.get('live_link') as string)?.trim() || null,
    video_url: (formData.get('video_url') as string)?.trim() || null,
    introduction: (formData.get('introduction') as string)?.trim() || null,
    what_i_did: (formData.get('what_i_did') as string)?.trim() || null,
    tech_stacks: techStacksData ? JSON.parse(techStacksData) : [],
    year: (formData.get('year') as string)?.trim() || null,
    category_id: formData.get('category_id') ? Number(formData.get('category_id')) : null,
  };

  try {
    await updateWork(id, input);
    revalidatePath('/admin/works');
    return { success: true, message: `Work "${title}" updated successfully.` };
  } catch (err: any) {
    console.error('Update Work Error:', err);
    return { success: false, error: 'Failed to update work.' };
  }
}

export async function deleteWorkAction(id: number): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  try {
    await deleteWork(id);
    revalidatePath('/admin/works');
    return { success: true, message: 'Work deleted successfully.' };
  } catch (err: any) {
    console.error('Delete Work Error:', err);
    return { success: false, error: 'Failed to delete work.' };
  }
}
