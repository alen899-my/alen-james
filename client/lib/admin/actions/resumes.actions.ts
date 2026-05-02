'use server';

import { getAdminSession } from '@/lib/auth';
import {
  createResume,
  updateResume,
  deleteResume,
  ResumeInput,
} from '@/lib/admin/models/resumes.model';
import { revalidatePath } from 'next/cache';

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function createResumeAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const name = (formData.get('name') as string)?.trim();
  const file_url = (formData.get('file_url') as string)?.trim();
  
  if (!name) return { success: false, error: 'Resume name is required.' };
  if (!file_url) return { success: false, error: 'Please upload a resume file.' };

  const is_active = formData.get('is_active') === 'on' || formData.get('is_active') === 'true';

  const input: ResumeInput = {
    name,
    file_url,
    is_active,
  };

  try {
    await createResume(input);
    revalidatePath('/admin/resumes');
    return { success: true, message: `Resume added successfully.` };
  } catch (err: any) {
    console.error('Create Resume Error:', err);
    return { success: false, error: 'Failed to add resume.' };
  }
}

export async function updateResumeAction(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const name = (formData.get('name') as string)?.trim();
  const file_url = (formData.get('file_url') as string)?.trim();
  
  if (!name) return { success: false, error: 'Resume name is required.' };
  if (!file_url) return { success: false, error: 'Please upload a resume file.' };

  const is_active = formData.get('is_active') === 'on' || formData.get('is_active') === 'true';

  const input: Partial<ResumeInput> = {
    name,
    file_url,
    is_active,
  };

  try {
    await updateResume(id, input);
    revalidatePath('/admin/resumes');
    return { success: true, message: `Resume updated successfully.` };
  } catch (err: any) {
    console.error('Update Resume Error:', err);
    return { success: false, error: 'Failed to update resume.' };
  }
}

export async function deleteResumeAction(id: number): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  try {
    await deleteResume(id);
    revalidatePath('/admin/resumes');
    return { success: true, message: 'Resume deleted successfully.' };
  } catch (err: any) {
    console.error('Delete Resume Error:', err);
    return { success: false, error: 'Failed to delete resume.' };
  }
}
