'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useSession, signOut } from 'next-auth/react';

import { useState } from 'react';
import { Transition } from '@headlessui/react';

export default function Navigation() {
  const t = useTranslations('navigation');
  const ta = useTranslations('auth');
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  // Wait for auth to be determined before rendering protected content
  if (status === 'loading') {
    return (
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="shrink-0 flex items-center">
                <span className="text-2xl font-bold text-indigo-600">
                  EphaHistos
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

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
              <Link href="/" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600">
                {t('home')}
              </Link>
              <Link
                href="/about"
                className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                {t('about')}
              </Link>
              {session && (
                <>
                  <Link 
                    href="/events" 
                    className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600"
                  >
                    {t('events')}
                  </Link>
                  <Link 
                    href="/donations" 
                    className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600"
                  >
                    {t('donations')}
                  </Link>
                  <Link 
                    href="/courses" 
                    className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600"
                  >
                    {t('courses')}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="hidden sm:flex sm:items-center">
            {session ? (
              <>
                <Link href="/dashboard" className="text-gray-900 hover:text-indigo-600 px-3 py-2">
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
                  className="text-gray-900 hover:text-indigo-600 px-3 py-2"
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

        {/* Mobile menu */}
        <Transition
          show={isOpen}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              >
                {t('home')}
              </Link>
              
              <Link
                href="/about"
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              >
                {t('about')}
              </Link>

              {session && (
                <>
                  <Link
                    href="/events"
                    className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                    title={!session ? t('requiresAuth') : ''}
                  >
                    {t('events')}
                  </Link>
                  <Link
                    href="/donations"
                    className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                    title={!session ? t('requiresAuth') : ''}
                  >
                    {t('donations')}
                  </Link>
                  <Link
                    href="/courses"
                    className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                    title={!session ? t('requiresAuth') : ''}
                  >
                    {t('courses')}
                  </Link>
                </>
              )}

              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  >
                    {t('dashboard')}
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  >
                    {t('signOut')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  >
                    {ta('signIn')}
                  </Link>
                  <Link
                    href="/register"
                    className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  >
                    {ta('register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </Transition>
      </div>
    </nav>
  );
}