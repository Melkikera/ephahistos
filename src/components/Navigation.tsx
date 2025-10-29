'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useSession, signOut } from 'next-auth/react';

export default function Navigation() {
  const t = useTranslations('navigation');
  const ta = useTranslations('auth');
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                EphaHistos
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="inline-flex items-center px-1 pt-1 text-gray-900">
                {t('home')}
              </Link>
              <Link href="/events" className="inline-flex items-center px-1 pt-1 text-gray-900">
                {t('events')}
              </Link>
              <Link href="/donations" className="inline-flex items-center px-1 pt-1 text-gray-900">
                {t('donations')}
              </Link>
              <Link href="/courses" className="inline-flex items-center px-1 pt-1 text-gray-900">
                {t('courses')}
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {session ? (
              <>
                <Link href="/dashboard" className="text-gray-900 hover:text-gray-700 px-3 py-2">
                  {t('dashboard')}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {t('signOut')}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-900 hover:text-gray-700 px-3 py-2"
                >
                  {ta('signIn')}
                </Link>
                <Link
                  href="/register"
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {ta('register')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}