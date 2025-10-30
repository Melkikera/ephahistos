import { Suspense } from 'react';
import { getDashboardData } from './actions';
import DashboardContent from './DashboardContent';
import DashboardLoading from './loading';

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent data={data} />
    </Suspense>
  );
}