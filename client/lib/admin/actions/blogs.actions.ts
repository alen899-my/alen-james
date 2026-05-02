'use server';

import { getAdminSession } from '@/lib/auth';
import {
  createBlog,
  updateBlog,
  deleteBlog,
  BlogInput,
} from '@/lib/admin/models/blogs.model';
import { revalidatePath } from 'next/cache';

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function createBlogAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const title = (formData.get('title') as string)?.trim();
  if (!title) {
    return { success: false, error: 'Blog title is required.' };
  }

  const status = (formData.get('status') as string) === 'inactive' ? 'inactive' : 'active';

  const input: BlogInput = {
    title,
    description: (formData.get('description') as string)?.trim() || null,
    main_image: (formData.get('main_image') as string)?.trim() || null,
    video_url: (formData.get('video_url') as string)?.trim() || null,
    status,
    publish_date: (formData.get('publish_date') as string)?.trim() || null,
  };

  try {
    await createBlog(input);
    revalidatePath('/admin/blogs');
    return { success: true, message: `Blog entry created successfully.` };
  } catch (err: any) {
    console.error('Create Blog Error:', err);
    return { success: false, error: 'Failed to create blog entry.' };
  }
}

export async function updateBlogAction(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const title = (formData.get('title') as string)?.trim();
  if (!title) {
    return { success: false, error: 'Blog title is required.' };
  }

  const status = (formData.get('status') as string) === 'inactive' ? 'inactive' : 'active';

  const input: Partial<BlogInput> = {
    title,
    description: (formData.get('description') as string)?.trim() || null,
    main_image: (formData.get('main_image') as string)?.trim() || null,
    video_url: (formData.get('video_url') as string)?.trim() || null,
    status,
    publish_date: (formData.get('publish_date') as string)?.trim() || null,
  };

  try {
    await updateBlog(id, input);
    revalidatePath('/admin/blogs');
    return { success: true, message: `Blog entry updated successfully.` };
  } catch (err: any) {
    console.error('Update Blog Error:', err);
    return { success: false, error: 'Failed to update blog entry.' };
  }
}

export async function deleteBlogAction(id: number): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  try {
    await deleteBlog(id);
    revalidatePath('/admin/blogs');
    return { success: true, message: 'Blog entry deleted successfully.' };
  } catch (err: any) {
    console.error('Delete Blog Error:', err);
    return { success: false, error: 'Failed to delete blog entry.' };
  }
}
