'use server';

import { getAdminSession } from '@/lib/auth';
import {
  getAllAdmins,
  createAdmin,
  updateAdminStatus,
  deleteAdmin,
} from '@/lib/admin/models/admin.model';
import { revalidatePath } from 'next/cache';

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function createAdminAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session || session.role !== 'superadmin') {
    return { success: false, error: 'Only superadmins can create admins.' };
  }

  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;
  const role = (formData.get('role') as 'admin' | 'superadmin') ?? 'admin';

  if (!name || !email || !password) {
    return { success: false, error: 'Name, email, and password are required.' };
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  try {
    await createAdmin({ name, email, password, role });
    revalidatePath('/admin/admins');
    return { success: true, message: `Admin "${name}" created successfully.` };
  } catch (err: any) {
    if (err?.code === '23505') return { success: false, error: 'An admin with this email already exists.' };
    return { success: false, error: 'Failed to create admin.' };
  }
}

export async function toggleAdminStatusAction(id: number, current: boolean): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session || session.role !== 'superadmin') {
    return { success: false, error: 'Only superadmins can manage admins.' };
  }
  if (session.id === id) {
    return { success: false, error: 'You cannot deactivate your own account.' };
  }

  await updateAdminStatus(id, !current);
  revalidatePath('/admin/admins');
  return { success: true, message: `Admin ${!current ? 'activated' : 'deactivated'}.` };
}

export async function deleteAdminAction(id: number): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session || session.role !== 'superadmin') {
    return { success: false, error: 'Only superadmins can delete admins.' };
  }
  if (session.id === id) {
    return { success: false, error: 'You cannot delete your own account.' };
  }

  await deleteAdmin(id);
  revalidatePath('/admin/admins');
  return { success: true, message: 'Admin deleted.' };
}
