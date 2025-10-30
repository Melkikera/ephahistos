'use client';

import { useTranslations } from 'next-intl';
import DashboardCard from '@/components/DashboardCard';
import {
  CalendarIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import type { DashboardData } from './actions';

export default function DashboardContent({ data }: { data: DashboardData }) {
  const t = useTranslations('dashboard');

  const donationsDisplay = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2
  }).format(data.donationsTotal);

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t('welcome', { name: 'User' })}
      </h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title={t('events')}
          value={data.events}
          description="Upcoming events"
          icon={<CalendarIcon className="h-6 w-6 text-white" />}
        />

        <DashboardCard
          title={t('courses')}
          value={data.courses}
          description="Available courses"
          icon={<AcademicCapIcon className="h-6 w-6 text-white" />}
        />

        <DashboardCard
          title={t('donations')}
          value={donationsDisplay}
          description="Total donations"
          icon={<CurrencyDollarIcon className="h-6 w-6 text-white" />}
        />
      </div>
    </div>
  );
}