'use client';
import { useTranslations } from 'next-intl';
import DashboardCard from '@/components/DashboardCard';
import {
  CalendarIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t('welcome', { name: 'User' })}
      </h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title={t('events')}
          value="5"
          description="Upcoming events this month"
          icon={<CalendarIcon className="h-6 w-6 text-white" />}
        />
        
        <DashboardCard
          title={t('courses')}
          value="3"
          description="Available courses"
          icon={<AcademicCapIcon className="h-6 w-6 text-white" />}
        />
        
        <DashboardCard
          title={t('donations')}
          value="€1,234"
          description="Total donations this month"
          icon={<CurrencyDollarIcon className="h-6 w-6 text-white" />}
        />
      </div>
    </div>
  );
}