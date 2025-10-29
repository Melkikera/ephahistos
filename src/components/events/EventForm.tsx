'use client';

import React, { useState } from 'react';
import { Event, CreateEventDTO } from '@/domain/entities/Event';

export default function EventForm({
  initial,
  onSubmit,
  onCancel
}: {
  initial?: Event;
  onSubmit: (data: Partial<CreateEventDTO>) => Promise<void> | void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [date, setDate] = useState(initial ? new Date(initial.date).toISOString().slice(0,16) : '');
  const [location, setLocation] = useState(initial?.location ?? '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-4">{initial ? 'Edit Event' : 'New Event'}</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm">Date</label>
            <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} className="w-full border px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm">Location</label>
            <input value={location} onChange={e => setLocation(e.target.value)} className="w-full border px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border px-2 py-1" />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-1" onClick={onCancel}>Cancel</button>
          <button
            className="px-3 py-1 bg-indigo-600 text-white rounded"
            onClick={() => onSubmit({ title, description, date: new Date(date), location })}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
