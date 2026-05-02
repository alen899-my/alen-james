'use server';

import { getAdminSession } from '@/lib/auth';
import {
  createSkill,
  updateSkill,
  deleteSkill,
  SkillInput,
} from '@/lib/admin/models/skills.model';
import { revalidatePath } from 'next/cache';

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function createSkillAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const name = (formData.get('name') as string)?.trim();
  if (!name) {
    return { success: false, error: 'Skill name is required.' };
  }

  const input: SkillInput = {
    name,
    image: (formData.get('image') as string)?.trim() || null,
    level: (formData.get('level') as string)?.trim() || null,
    experience: (formData.get('experience') as string)?.trim() || null,
  };

  try {
    await createSkill(input);
    revalidatePath('/admin/skills');
    return { success: true, message: `Skill created successfully.` };
  } catch (err: any) {
    console.error('Create Skill Error:', err);
    return { success: false, error: 'Failed to create skill.' };
  }
}

export async function updateSkillAction(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const name = (formData.get('name') as string)?.trim();
  if (!name) {
    return { success: false, error: 'Skill name is required.' };
  }

  const input: Partial<SkillInput> = {
    name,
    image: (formData.get('image') as string)?.trim() || null,
    level: (formData.get('level') as string)?.trim() || null,
    experience: (formData.get('experience') as string)?.trim() || null,
  };

  try {
    await updateSkill(id, input);
    revalidatePath('/admin/skills');
    return { success: true, message: `Skill updated successfully.` };
  } catch (err: any) {
    console.error('Update Skill Error:', err);
    return { success: false, error: 'Failed to update skill.' };
  }
}

export async function deleteSkillAction(id: number): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  try {
    await deleteSkill(id);
    revalidatePath('/admin/skills');
    return { success: true, message: 'Skill deleted successfully.' };
  } catch (err: any) {
    console.error('Delete Skill Error:', err);
    return { success: false, error: 'Failed to delete skill.' };
  }
}
