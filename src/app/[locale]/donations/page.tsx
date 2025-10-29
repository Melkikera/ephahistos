import DonationsClient from '@/components/donations/DonationsClient';

export default function DonationsPage({ params }: { params: { locale: string } }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Donations</h1>
  <DonationsClient />
    </div>
  );
}
