import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const pathname = req.nextUrl.pathname;

      // Public routes
      if (
        pathname.startsWith('/auth') ||
        pathname.startsWith('/eom/winners') ||
        pathname.startsWith('/help') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api/auth')
      ) {
        return true;
      }

      // All other routes require authentication
      if (!token) {
        return false;
      }

      // Admin routes
      if (pathname.startsWith('/admin')) {
        return token.role === 'CEO' || token.role === 'PC';
      }

      // EOM nomination and voting
      if (pathname.startsWith('/eom/nominate') || pathname.startsWith('/eom/vote')) {
        return ['CEO', 'PC', 'LEAD'].includes(token.role as string);
      }

      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
