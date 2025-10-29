'use client';

import React, { useState } from 'react';
import { Course } from '@/domain/entities/Course';

export default function CourseForm({
  initial,
  onSubmit,
  onCancel
}: {
  initial?: Course;
  onSubmit: (data: Partial<Course>) => Promise<void> | void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [startDate, setStartDate] = useState(initial ? new Date(initial.startDate).toISOString().slice(0,10) : '');
  const [endDate, setEndDate] = useState(initial ? new Date(initial.endDate).toISOString().slice(0,10) : '');
  const [capacity, setCapacity] = useState(initial?.capacity ?? 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-4">{initial ? 'Edit Course' : 'New Course'}</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm">Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm">End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm">Capacity</label>
            <input type="number" value={capacity} onChange={e => setCapacity(Number(e.target.value))} className="w-full border px-2 py-1" />
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
            onClick={() => onSubmit({ title, description, startDate: new Date(startDate), endDate: new Date(endDate), capacity })}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
