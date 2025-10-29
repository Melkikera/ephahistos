'use client';

import React, { useEffect, useState } from 'react';
import EventForm from './EventForm';
import { Event } from '@/domain/entities/Event';

export default function EventsClient() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function fetchEvents() {
    setLoading(true);
    try {
      const res = await fetch(`/fr/api/events`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  async function handleCreate(payload: Partial<Event>) {
    const res = await fetch(`/fr/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      await fetchEvents();
      setShowForm(false);
    }
  }

  async function handleUpdate(payload: Partial<Event> & { id: string }) {
    const res = await fetch(`/fr/api/events`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      await fetchEvents();
      setEditing(null);
      setShowForm(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this event?')) return;
    const res = await fetch(`/fr/api/events?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      await fetchEvents();
    }
  }

  return (
    <div>
      <div className="mb-4">
        <button
          className="rounded bg-indigo-600 text-white px-3 py-1"
          onClick={() => { setShowForm(true); setEditing(null); }}
        >
          New Event
        </button>
      </div>

      {loading && <div>Loading...</div>}

      <div className="grid gap-4">
        {events.map(ev => (
          <div key={ev.id} className="p-4 border rounded">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{ev.title}</h3>
                <p className="text-sm text-gray-600">{new Date(ev.date).toLocaleString()}</p>
                <p className="mt-2">{ev.description}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button className="text-indigo-600" onClick={() => { setEditing(ev); setShowForm(true); }}>Edit</button>
                <button className="text-red-600" onClick={() => handleDelete(ev.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <EventForm
          initial={editing ?? undefined}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          onSubmit={async (payload: any) => {
            if (editing) {
              await handleUpdate({ ...payload, id: editing.id } as any);
            } else {
              await handleCreate(payload as any);
            }
          }}
        />
      )}
    </div>
  );
}
