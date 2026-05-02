'use server';

import { getAdminSession } from '@/lib/auth';
import {
  createEducation,
  updateEducation,
  deleteEducation,
  EducationInput,
} from '@/lib/admin/models/education.model';
import { revalidatePath } from 'next/cache';

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function createEducationAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const name = (formData.get('name') as string)?.trim();
  if (!name) {
    return { success: false, error: 'Name of institution is required.' };
  }

  const galleryData = formData.get('gallery') as string;
  const videosData = formData.get('videos') as string;

  const input: EducationInput = {
    name,
    year_from: (formData.get('year_from') as string)?.trim() || null,
    year_to: (formData.get('year_to') as string)?.trim() || null,
    studied: (formData.get('studied') as string)?.trim() || null,
    about_education: (formData.get('about_education') as string)?.trim() || null,
    achievements: (formData.get('achievements') as string)?.trim() || null,
    gallery: galleryData ? JSON.parse(galleryData) : [],
    videos: videosData ? JSON.parse(videosData) : [],
    school_photo: (formData.get('school_photo') as string)?.trim() || null,
    school_location: (formData.get('school_location') as string)?.trim() || null,
    grade_mark: (formData.get('grade_mark') as string)?.trim() || null,
  };

  try {
    await createEducation(input);
    revalidatePath('/admin/education');
    return { success: true, message: `Education entry created successfully.` };
  } catch (err: any) {
    console.error('Create Education Error:', err);
    return { success: false, error: 'Failed to create education entry.' };
  }
}

export async function updateEducationAction(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const name = (formData.get('name') as string)?.trim();
  if (!name) {
    return { success: false, error: 'Name of institution is required.' };
  }

  const galleryData = formData.get('gallery') as string;
  const videosData = formData.get('videos') as string;

  const input: Partial<EducationInput> = {
    name,
    year_from: (formData.get('year_from') as string)?.trim() || null,
    year_to: (formData.get('year_to') as string)?.trim() || null,
    studied: (formData.get('studied') as string)?.trim() || null,
    about_education: (formData.get('about_education') as string)?.trim() || null,
    achievements: (formData.get('achievements') as string)?.trim() || null,
    gallery: galleryData ? JSON.parse(galleryData) : [],
    videos: videosData ? JSON.parse(videosData) : [],
    school_photo: (formData.get('school_photo') as string)?.trim() || null,
    school_location: (formData.get('school_location') as string)?.trim() || null,
    grade_mark: (formData.get('grade_mark') as string)?.trim() || null,
  };

  try {
    await updateEducation(id, input);
    revalidatePath('/admin/education');
    return { success: true, message: `Education entry updated successfully.` };
  } catch (err: any) {
    console.error('Update Education Error:', err);
    return { success: false, error: 'Failed to update education entry.' };
  }
}

export async function deleteEducationAction(id: number): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  try {
    await deleteEducation(id);
    revalidatePath('/admin/education');
    return { success: true, message: 'Education entry deleted successfully.' };
  } catch (err: any) {
    console.error('Delete Education Error:', err);
    return { success: false, error: 'Failed to delete education entry.' };
  }
}
