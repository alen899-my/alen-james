'use server';

import { getAdminSession } from '@/lib/auth';
import {
  createPerson,
  updatePerson,
  deletePerson,
  PersonInput,
} from '@/lib/admin/models/people.model';
import { updateSettings } from '@/lib/admin/models/settings.model';
import { revalidatePath } from 'next/cache';

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function createPersonAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const name = (formData.get('name') as string)?.trim();
  if (!name) {
    return { success: false, error: 'Name is required.' };
  }

  const imagesData = formData.get('images') as string;
  const videosData = formData.get('videos') as string;
  
  const isPublicRaw = formData.get('is_public');
  const is_public = isPublicRaw === 'true' || isPublicRaw === 'on';

  const input: PersonInput = {
    name,
    relation: (formData.get('relation') as string)?.trim() || null,
    about_them: (formData.get('about_them') as string)?.trim() || null,
    images: imagesData ? JSON.parse(imagesData) : [],
    videos: videosData ? JSON.parse(videosData) : [],
    is_public,
    password: (formData.get('password') as string)?.trim() || null,
  };

  try {
    await createPerson(input);
    revalidatePath('/admin/people');
    return { success: true, message: `Person profile created successfully.` };
  } catch (err: any) {
    console.error('Create Person Error:', err);
    return { success: false, error: 'Failed to create person profile.' };
  }
}

export async function updatePersonAction(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const name = (formData.get('name') as string)?.trim();
  if (!name) {
    return { success: false, error: 'Name is required.' };
  }

  const imagesData = formData.get('images') as string;
  const videosData = formData.get('videos') as string;
  
  const isPublicRaw = formData.get('is_public');
  const is_public = isPublicRaw === 'true' || isPublicRaw === 'on';

  const input: Partial<PersonInput> = {
    name,
    relation: (formData.get('relation') as string)?.trim() || null,
    about_them: (formData.get('about_them') as string)?.trim() || null,
    images: imagesData ? JSON.parse(imagesData) : [],
    videos: videosData ? JSON.parse(videosData) : [],
    is_public,
    password: (formData.get('password') as string)?.trim() || null,
  };

  try {
    await updatePerson(id, input);
    revalidatePath('/admin/people');
    return { success: true, message: `Person profile updated successfully.` };
  } catch (err: any) {
    console.error('Update Person Error:', err);
    return { success: false, error: 'Failed to update person profile.' };
  }
}

export async function deletePersonAction(id: number): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  try {
    await deletePerson(id);
    revalidatePath('/admin/people');
    return { success: true, message: 'Person profile deleted successfully.' };
  } catch (err: any) {
    console.error('Delete Person Error:', err);
    return { success: false, error: 'Failed to delete person profile.' };
  }
}

export async function updateGlobalPeoplePasswordAction(password: string): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  try {
    await updateSettings({ people_global_password: password || null });
    revalidatePath('/admin/people');
    return { success: true, message: 'Global people password updated.' };
  } catch (err: any) {
    console.error('Update Global Password Error:', err);
    return { success: false, error: 'Failed to update global password.' };
  }
}
