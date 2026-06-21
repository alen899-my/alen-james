'use server';

import { getAdminSession } from '@/lib/auth';
import {
  createWhatsNew,
  updateWhatsNew,
  deleteWhatsNew,
  WhatsNewInput,
} from '@/lib/admin/models/whats_new.model';
import { revalidatePath } from 'next/cache';

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function createWhatsNewAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const title = (formData.get('title') as string)?.trim();
  const content = (formData.get('content') as string)?.trim();
  const image_url = (formData.get('image_url') as string)?.trim() || null;
  const btn_text = (formData.get('btn_text') as string)?.trim() || null;
  const btn_url = (formData.get('btn_url') as string)?.trim() || null;

  if (!title) return { success: false, error: 'Title is required.' };
  if (!content) return { success: false, error: 'Content is required.' };

  const is_active = formData.get('is_active') === 'on' || formData.get('is_active') === 'true';

  const input: WhatsNewInput = {
    title,
    content,
    image_url,
    btn_text,
    btn_url,
    is_active,
  };

  try {
    await createWhatsNew(input);
    revalidatePath('/admin/whats-new');
    revalidatePath('/');
    return { success: true, message: 'Announcement created successfully.' };
  } catch (err: any) {
    console.error('Create WhatsNew Error:', err);
    return { success: false, error: 'Failed to create announcement.' };
  }
}

export async function updateWhatsNewAction(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const title = (formData.get('title') as string)?.trim();
  const content = (formData.get('content') as string)?.trim();
  const image_url = (formData.get('image_url') as string)?.trim() || null;
  const btn_text = (formData.get('btn_text') as string)?.trim() || null;
  const btn_url = (formData.get('btn_url') as string)?.trim() || null;

  if (!title) return { success: false, error: 'Title is required.' };
  if (!content) return { success: false, error: 'Content is required.' };

  const is_active = formData.get('is_active') === 'on' || formData.get('is_active') === 'true';

  const input: Partial<WhatsNewInput> = {
    title,
    content,
    image_url,
    btn_text,
    btn_url,
    is_active,
  };

  try {
    await updateWhatsNew(id, input);
    revalidatePath('/admin/whats-new');
    revalidatePath('/');
    return { success: true, message: 'Announcement updated successfully.' };
  } catch (err: any) {
    console.error('Update WhatsNew Error:', err);
    return { success: false, error: 'Failed to update announcement.' };
  }
}

export async function deleteWhatsNewAction(id: number): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  try {
    await deleteWhatsNew(id);
    revalidatePath('/admin/whats-new');
    revalidatePath('/');
    return { success: true, message: 'Announcement deleted successfully.' };
  } catch (err: any) {
    console.error('Delete WhatsNew Error:', err);
    return { success: false, error: 'Failed to delete announcement.' };
  }
}
