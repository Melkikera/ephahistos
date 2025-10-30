import prisma from '@/lib/prisma';

export type DashboardData = {
  events: number;
  courses: number;
  donationsCount: number;
  donationsTotal: number;
};

export async function getDashboardData(): Promise<DashboardData> {
  const [events, courses, donationsCountResult, donationsSumResult] = await Promise.all([
    prisma.event.count(),
    prisma.course.count(),
    prisma.donation.count(),
    prisma.donation.aggregate({ _sum: { amount: true } }),
  ]);

  return {
    events,
    courses,
    donationsCount: donationsCountResult,
    donationsTotal: donationsSumResult._sum.amount ?? 0,
  };
}