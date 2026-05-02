'use server';

import { getAdminSession } from '@/lib/auth';
import {
  createExperience,
  updateExperience,
  deleteExperience,
  ExperienceInput,
} from '@/lib/admin/models/experiences.model';
import { revalidatePath } from 'next/cache';

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function createExperienceAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const job_title = (formData.get('job_title') as string)?.trim();
  if (!job_title) {
    return { success: false, error: 'Job title is required.' };
  }

  const imagesData = formData.get('images') as string;
  const videosData = formData.get('videos') as string;

  const input: ExperienceInput = {
    job_title,
    location: (formData.get('location') as string)?.trim() || null,
    from_date: (formData.get('from_date') as string)?.trim() || null,
    to_date: (formData.get('to_date') as string)?.trim() || null,
    description: (formData.get('description') as string)?.trim() || null,
    images: imagesData ? JSON.parse(imagesData) : [],
    videos: videosData ? JSON.parse(videosData) : [],
  };

  try {
    await createExperience(input);
    revalidatePath('/admin/experiences');
    return { success: true, message: `Experience entry created successfully.` };
  } catch (err: any) {
    console.error('Create Experience Error:', err);
    return { success: false, error: 'Failed to create experience entry.' };
  }
}

export async function updateExperienceAction(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const job_title = (formData.get('job_title') as string)?.trim();
  if (!job_title) {
    return { success: false, error: 'Job title is required.' };
  }

  const imagesData = formData.get('images') as string;
  const videosData = formData.get('videos') as string;

  const input: Partial<ExperienceInput> = {
    job_title,
    location: (formData.get('location') as string)?.trim() || null,
    from_date: (formData.get('from_date') as string)?.trim() || null,
    to_date: (formData.get('to_date') as string)?.trim() || null,
    description: (formData.get('description') as string)?.trim() || null,
    images: imagesData ? JSON.parse(imagesData) : [],
    videos: videosData ? JSON.parse(videosData) : [],
  };

  try {
    await updateExperience(id, input);
    revalidatePath('/admin/experiences');
    return { success: true, message: `Experience entry updated successfully.` };
  } catch (err: any) {
    console.error('Update Experience Error:', err);
    return { success: false, error: 'Failed to update experience entry.' };
  }
}

export async function deleteExperienceAction(id: number): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  try {
    await deleteExperience(id);
    revalidatePath('/admin/experiences');
    return { success: true, message: 'Experience entry deleted successfully.' };
  } catch (err: any) {
    console.error('Delete Experience Error:', err);
    return { success: false, error: 'Failed to delete experience entry.' };
  }
}
