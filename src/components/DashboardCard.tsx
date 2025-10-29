import { useTranslations } from 'next-intl';

type DashboardCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
};

export default function DashboardCard({ title, value, description, icon }: DashboardCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="rounded-md bg-indigo-500 p-3">
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
              </dd>
              <dd className="mt-1 text-sm text-gray-500">
                {description}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}