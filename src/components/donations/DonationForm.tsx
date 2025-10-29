'use client';

import React, { useState } from 'react';
import { CreateDonationDTO, Donation } from '@/domain/entities/Donation';

export default function DonationForm({
  initial,
  onSubmit,
  onCancel
}: {
  initial?: Donation;
  onSubmit: (data: Partial<CreateDonationDTO>) => Promise<void> | void;
  onCancel: () => void;
}) {
  const [donorName, setDonorName] = useState(initial?.donorName ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [amount, setAmount] = useState(initial?.amount ?? 0);
  const [currency, setCurrency] = useState(initial?.currency ?? 'EUR');
  const [message, setMessage] = useState(initial?.message ?? '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-4">{initial ? 'Edit Donation' : 'New Donation'}</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm">Donor name</label>
            <input value={donorName} onChange={e => setDonorName(e.target.value)} className="w-full border px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="w-full border px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm">Amount</label>
            <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full border px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm">Currency</label>
            <input value={currency} onChange={e => setCurrency(e.target.value)} className="w-full border px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm">Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full border px-2 py-1" />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-1" onClick={onCancel}>Cancel</button>
          <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={() => onSubmit({ donorName, email, amount, currency, message })}>Save</button>
        </div>
      </div>
    </div>
  );
}
