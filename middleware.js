import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.pathname;

  // Bloqueia tudo que começa com /superadmin para não superadmins
  if (url.startsWith('/superadmin')) {
    if (!token || token.user?.role !== 'superadmin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Permite acesso normal
  return NextResponse.next();
}

export const config = {
  matcher: ['/superadmin/:path*'],
};
