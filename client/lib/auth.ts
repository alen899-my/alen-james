import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { cache } from 'react';

const COOKIE_NAME = process.env.ADMIN_COOKIE_NAME ?? 'admin_session';
const EXPIRES_SECONDS = 7 * 24 * 60 * 60; // 7 days

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  return new TextEncoder().encode(secret);
}

export interface AdminSessionPayload extends JWTPayload {
  id: number;
  email: string;
  name: string;
  role: string;
}

/** Sign a new JWT for the admin session */
export async function signAdminToken(payload: Omit<AdminSessionPayload, keyof JWTPayload>): Promise<string> {
  return new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

/** Verify a JWT and return its payload */
export async function verifyAdminToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as AdminSessionPayload;
  } catch {
    return null;
  }
}

/** Read and verify the current session from cookies — cached per-request */
export const getAdminSession = cache(async (): Promise<AdminSessionPayload | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
});

/** Set the admin session cookie */
export async function setAdminSession(payload: Omit<AdminSessionPayload, keyof JWTPayload>): Promise<void> {
  const token = await signAdminToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: EXPIRES_SECONDS,
    path: '/',
  });
}

/** Clear the admin session cookie */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
