import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = process.env.ADMIN_COOKIE_NAME ?? 'admin_session';
const PUBLIC_PATHS = ['/admin/login'];

function getSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.JWT_SECRET ?? '');
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /admin routes
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    if (isPublic) return NextResponse.next();
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, getSecret());
    // Already logged in — redirect away from login
    if (isPublic) return NextResponse.redirect(new URL('/admin', req.url));
    return NextResponse.next();
  } catch {
    // Invalid/expired token
    const res = NextResponse.redirect(new URL('/admin/login', req.url));
    res.cookies.delete(COOKIE_NAME);
    return res;
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
