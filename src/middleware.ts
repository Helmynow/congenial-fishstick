import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Exclude paths that don't require authentication
  const publicPaths = [
    '/auth/signin',
    '/auth/verify',
    '/auth/error',
    '/api/auth',
    '/eom/winners',
    '/help',
  ];
  
  const isPublicPath = publicPaths.some(
    (pp) => path === pp || path.startsWith(`${pp}/`)
  );
  
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // Check for auth token
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    // If no token, redirect to signin
    if (!token) {
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
    
    // Role-based path restrictions
    const adminOnlyPaths = ['/admin', '/settings/system'];
    const userRole = token.role as string;
    
    if (adminOnlyPaths.some(p => path.startsWith(p)) && 
        !['CEO', 'PC'].includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
    // EOM nomination and voting restrictions
    const eomRestrictedPaths = ['/eom/nominate', '/eom/vote'];
    if (eomRestrictedPaths.some(p => path.startsWith(p)) &&
        !['CEO', 'PC', 'LEAD'].includes(userRole)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Continue if authenticated and authorized
    return NextResponse.next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    // In case of error, redirect to error page
    const url = new URL('/auth/error', request.url);
    url.searchParams.set('error', 'Configuration');
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
