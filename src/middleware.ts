import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withAuth } from 'next-auth/middleware'
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequestWithAuth } from 'next-auth/middleware';

const locales = ['en', 'fr'];
const publicPages = ['/', '/login', '/register'];
const protectedPages = ['/events', '/donations', '/courses', '/dashboard'];

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'en'
});

export default async function middleware(request: NextRequestWithAuth, event: any) {
  const pathname = request.nextUrl.pathname;

  // Normalize pathname by stripping a leading locale segment (e.g. /en, /fr)
  const normalizedPath = pathname.replace(/^\/(?:en|fr)(?=\/|$)/, '') || '/';

  // Handle public pages with internationalization
  if (publicPages.some(page => normalizedPath.startsWith(page))) {
    return intlMiddleware(request);
  }

  // Explicitly check protected pages
  if (protectedPages.some(page => normalizedPath.startsWith(page))) {
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

  // Handle all other pages with auth and internationalization
  return withAuth(
    function middleware(req, event) {
      return intlMiddleware(req);
    },
    {
      callbacks: {
        authorized: ({ token }) => token !== null
      },
      pages: {
        // Use locale-less sign-in path; intlMiddleware will redirect to the proper locale
        signIn: '/login',
      }
    }
  )(request, event);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}