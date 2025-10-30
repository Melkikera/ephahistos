'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="relative w-48 h-48 mx-auto mb-8">
          <div className="rounded-full bg-gray-200 w-full h-full flex items-center justify-center">
            {/* Placeholder for profile picture */}
            <svg 
              className="h-24 w-24 text-gray-400" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('title')}
        </h1>
      </div>

      <div className="prose prose-lg mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {t('experience.title')}
        </h2>
        <p className="text-gray-600 mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {t('expertise.title')}
        </h2>
        <p className="text-gray-600">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
    </div>
  );
}