'use server';

import { getAdminSession } from '@/lib/auth';
import {
  createConstruction,
  updateConstruction,
  deleteConstruction,
  ConstructionInput,
} from '@/lib/admin/models/constructions.model';
import { revalidatePath } from 'next/cache';

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function createConstructionAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const name = (formData.get('name') as string)?.trim();
  if (!name) return { success: false, error: 'Name is required.' };

  const stacksData = formData.get('stacks') as string;

  const input: ConstructionInput = {
    name,
    tagline: (formData.get('tagline') as string)?.trim() || null,
    main_image: (formData.get('main_image') as string)?.trim() || null,
    stacks: stacksData ? JSON.parse(stacksData) : [],
    project_idea: (formData.get('project_idea') as string)?.trim() || null,
    features: (formData.get('features') as string)?.trim() || null,
    construction_phase: (formData.get('construction_phase') as string)?.trim() || 'Planning',
    is_upcoming: formData.get('is_upcoming') === 'true',
    status: (formData.get('status') as 'active' | 'inactive') || 'active',
  };

  try {
    await createConstruction(input);
    revalidatePath('/admin/constructions');
    revalidatePath('/under-construction');
    return { success: true, message: `"${name}" added successfully.` };
  } catch (err: any) {
    console.error('Create Construction Error:', err);
    return { success: false, error: 'Failed to create construction entry.' };
  }
}

export async function updateConstructionAction(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const name = (formData.get('name') as string)?.trim();
  if (!name) return { success: false, error: 'Name is required.' };

  const stacksData = formData.get('stacks') as string;

  const input: Partial<ConstructionInput> = {
    name,
    tagline: (formData.get('tagline') as string)?.trim() || null,
    main_image: (formData.get('main_image') as string)?.trim() || null,
    stacks: stacksData ? JSON.parse(stacksData) : [],
    project_idea: (formData.get('project_idea') as string)?.trim() || null,
    features: (formData.get('features') as string)?.trim() || null,
    construction_phase: (formData.get('construction_phase') as string)?.trim() || 'Planning',
    is_upcoming: formData.get('is_upcoming') === 'true',
    status: (formData.get('status') as 'active' | 'inactive') || 'active',
  };

  try {
    await updateConstruction(id, input);
    revalidatePath('/admin/constructions');
    revalidatePath(`/under-construction/${id}`);
    revalidatePath('/under-construction');
    return { success: true, message: `"${name}" updated successfully.` };
  } catch (err: any) {
    console.error('Update Construction Error:', err);
    return { success: false, error: 'Failed to update construction entry.' };
  }
}

export async function deleteConstructionAction(id: number): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  try {
    await deleteConstruction(id);
    revalidatePath('/admin/constructions');
    revalidatePath('/under-construction');
    return { success: true, message: 'Entry deleted successfully.' };
  } catch (err: any) {
    console.error('Delete Construction Error:', err);
    return { success: false, error: 'Failed to delete entry.' };
  }
}
