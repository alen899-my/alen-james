'use server';

import { redirect } from 'next/navigation';
import { setAdminSession, clearAdminSession, getAdminSession } from '@/lib/auth';
import {
  findAdminByEmail,
  updateLastLogin,
  updateAdminProfile,
  changeAdminPassword,
  verifyPassword,
  findAdminById,
} from '@/lib/admin/models/admin.model';

// ── Login ─────────────────────────────────────────────────────────────────────

export interface LoginState { error?: string }

export async function loginAction(
  _prevState: LoginState | null,
  formData: FormData
): Promise<LoginState> {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;

  if (!email || !password) return { error: 'Email and password are required.' };

  const admin = await findAdminByEmail(email);
  if (!admin) return { error: 'Invalid credentials.' };
  if (!admin.is_active) return { error: 'Your account has been deactivated.' };

  const valid = await verifyPassword(password, admin.password);
  if (!valid) return { error: 'Invalid credentials.' };

  await updateLastLogin(admin.id);
  await setAdminSession({ id: admin.id, email: admin.email, name: admin.name, role: admin.role });
  redirect('/admin');
}

// ── Logout ────────────────────────────────────────────────────────────────────

export async function logoutAction(): Promise<void> {
  await clearAdminSession();
  redirect('/admin/login');
}

// ── Profile Update ────────────────────────────────────────────────────────────

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function updateProfileAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const name = (formData.get('name') as string)?.trim();
  const phone = (formData.get('phone') as string)?.trim();

  if (!name) return { success: false, error: 'Name is required.' };

  await updateAdminProfile(session.id, { name, phone: phone || undefined });
  return { success: true, message: 'Profile updated successfully.' };
}

// ── Password Change ────────────────────────────────────────────────────────────

export async function changePasswordAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated.' };

  const currentPassword = formData.get('current_password') as string;
  const newPassword = formData.get('new_password') as string;
  const confirmPassword = formData.get('confirm_password') as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, error: 'All fields are required.' };
  }
  if (newPassword !== confirmPassword) {
    return { success: false, error: 'New passwords do not match.' };
  }
  if (newPassword.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const admin = await findAdminById(session.id) as any;
  if (!admin) return { success: false, error: 'Admin not found.' };

  // Need password to verify — fetch with password
  const adminWithPw = await findAdminByEmail(session.email);
  if (!adminWithPw) return { success: false, error: 'Admin not found.' };

  const valid = await verifyPassword(currentPassword, adminWithPw.password);
  if (!valid) return { success: false, error: 'Current password is incorrect.' };

  await changeAdminPassword(session.id, newPassword);
  return { success: true, message: 'Password changed successfully.' };
}
