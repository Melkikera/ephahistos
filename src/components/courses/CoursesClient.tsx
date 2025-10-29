'use client';

import React, { useEffect, useState } from 'react';
import CourseForm from './CourseForm';
import { Course } from '@/domain/entities/Course';

export default function CoursesClient() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function fetchCourses() {
    setLoading(true);
    try {
      const res = await fetch(`/fr/api/courses`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchCourses(); }, []);

  async function handleCreate(payload: Partial<Course>) {
    const res = await fetch(`/fr/api/courses`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    if (res.ok) { await fetchCourses(); setShowForm(false); }
  }

  async function handleUpdate(payload: Partial<Course> & { id: string }) {
    const res = await fetch(`/fr/api/courses`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    if (res.ok) { await fetchCourses(); setEditing(null); setShowForm(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this course?')) return;
    const res = await fetch(`/fr/api/courses?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) { await fetchCourses(); }
  }

  return (
    <div>
      <div className="mb-4">
        <button className="rounded bg-indigo-600 text-white px-3 py-1" onClick={() => { setShowForm(true); setEditing(null); }}>New Course</button>
      </div>

      {loading && <div>Loading...</div>}

      <div className="grid gap-4">
        {courses.map(c => (
          <div key={c.id} className="p-4 border rounded">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{c.title}</h3>
                <p className="text-sm text-gray-600">{new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}</p>
                <p className="mt-2">{c.description}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button className="text-indigo-600" onClick={() => { setEditing(c); setShowForm(true); }}>Edit</button>
                <button className="text-red-600" onClick={() => handleDelete(c.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <CourseForm
          initial={editing ?? undefined}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          onSubmit={async (payload: any) => {
            if (editing) { await handleUpdate({ ...payload, id: editing.id } as any); }
            else { await handleCreate(payload as any); }
          }}
        />
      )}
    </div>
  );
}
