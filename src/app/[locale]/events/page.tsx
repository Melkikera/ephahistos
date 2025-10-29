import EventsClient from '@/components/events/EventsClient';

export default function EventsPage({ params }: { params: { locale: string } }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      {/* Client component handles fetch and UI interactions */}
      <EventsClient />
    </div>
  );
}
