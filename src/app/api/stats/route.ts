import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [events, courses, donationsCountResult, donationsSumResult] = await Promise.all([
      prisma.event.count(),
      prisma.course.count(),
      prisma.donation.count(),
      prisma.donation.aggregate({ _sum: { amount: true } }),
    ]);

    const donationsTotal = donationsSumResult._sum.amount ?? 0;

    const body = {
      events,
      courses,
      donationsCount: donationsCountResult,
      donationsTotal,
    };

    // Cache the stats for 60 seconds at the CDN (s-maxage) and allow stale while revalidate
    return NextResponse.json(body, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('Error fetching stats', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
