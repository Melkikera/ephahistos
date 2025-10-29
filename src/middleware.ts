import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withAuth } from 'next-auth/middleware'
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequestWithAuth } from 'next-auth/middleware';

const locales = ['en', 'fr'];
const publicPages = ['/', '/login', '/register'];

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'en'
});

export default async function middleware(request: NextRequestWithAuth, event: any) {
  const pathname = request.nextUrl.pathname;

  // Handle public pages with internationalization
  if (publicPages.some(page => pathname.startsWith(page))) {
    return intlMiddleware(request);
  }

  // Handle protected pages with auth and internationalization
  return withAuth(
    function middleware(req, event) {
      return intlMiddleware(req);
    },
    {
      callbacks: {
        authorized: ({ token }) => token !== null
      },
      pages: {
        signIn: '/login',
      }
    }
  )(request, event);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}