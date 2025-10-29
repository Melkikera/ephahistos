'use client';

import React, { useEffect, useState } from 'react';
import DonationForm from './DonationForm';
import { Donation } from '@/domain/entities/Donation';

export default function DonationsClient() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Donation | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function fetchDonations() {
    setLoading(true);
    try {
      const res = await fetch(`/fr/api/donations`);
      if (res.ok) { const data = await res.json(); setDonations(data || []); }
    } finally { setLoading(false); }
  }

  useEffect(() => { fetchDonations(); }, []);

  async function handleCreate(payload: Partial<Donation>) {
    const res = await fetch(`/fr/api/donations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) { await fetchDonations(); setShowForm(false); }
  }

  async function handleUpdate(payload: Partial<Donation> & { id: string }) {
    const res = await fetch(`/fr/api/donations`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) { await fetchDonations(); setEditing(null); setShowForm(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this donation?')) return;
    const res = await fetch(`/fr/api/donations?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) { await fetchDonations(); }
  }

  return (
    <div>
      <div className="mb-4">
        <button className="rounded bg-indigo-600 text-white px-3 py-1" onClick={() => { setShowForm(true); setEditing(null); }}>New Donation</button>
      </div>

      {loading && <div>Loading...</div>}

      <div className="grid gap-4">
        {donations.map(d => (
          <div key={d.id} className="p-4 border rounded">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{d.donorName} — {d.amount} {d.currency}</h3>
                <p className="text-sm text-gray-600">{new Date(d.createdAt).toLocaleString()}</p>
                {d.message && <p className="mt-2">{d.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <button className="text-indigo-600" onClick={() => { setEditing(d); setShowForm(true); }}>Edit</button>
                <button className="text-red-600" onClick={() => handleDelete(d.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <DonationForm
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
