'use server';

import { getAdminSession } from '@/lib/auth';
import {
  createWorkCategory,
  updateWorkCategory,
  deleteWorkCategory,
  WorkCategoryInput,
} from '@/lib/admin/models/work_categories.model';
import { revalidatePath } from 'next/cache';

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function createWorkCategoryAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const name = (formData.get('name') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim();

  if (!name || !slug) {
    return { success: false, error: 'Name and Slug are required.' };
  }

  const input: WorkCategoryInput = { name, slug };

  try {
    await createWorkCategory(input);
    revalidatePath('/admin/work-categories');
    return { success: true, message: `Category "${name}" created successfully.` };
  } catch (err: any) {
    console.error('Create Work Category Error:', err);
    return { success: false, error: 'Failed to create category. Slug might be taken.' };
  }
}

export async function updateWorkCategoryAction(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const name = (formData.get('name') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim();

  if (!name || !slug) {
    return { success: false, error: 'Name and Slug are required.' };
  }

  const input: Partial<WorkCategoryInput> = { name, slug };

  try {
    await updateWorkCategory(id, input);
    revalidatePath('/admin/work-categories');
    return { success: true, message: `Category "${name}" updated successfully.` };
  } catch (err: any) {
    console.error('Update Work Category Error:', err);
    return { success: false, error: 'Failed to update category.' };
  }
}

export async function deleteWorkCategoryAction(id: number): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  try {
    await deleteWorkCategory(id);
    revalidatePath('/admin/work-categories');
    return { success: true, message: 'Category deleted successfully.' };
  } catch (err: any) {
    console.error('Delete Work Category Error:', err);
    return { success: false, error: 'Failed to delete category.' };
  }
}
