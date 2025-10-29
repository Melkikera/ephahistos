export type DonationItem = {
  id: string;
  donorName: string;
  email: string;
  amount: number;
  currency: string;
  message?: string;
  status: 'PENDING' | 'COMPLETED';
  createdAt: string;
};

const KEY = 'ephahistos_donations_v1';

const defaultData: DonationItem[] = [
  { id: 'd1', donorName: 'Alice', email: 'alice@example.com', amount: 50, currency: 'EUR', message: 'Keep it up!', status: 'COMPLETED', createdAt: new Date().toISOString() },
  { id: 'd2', donorName: 'Bob', email: 'bob@example.com', amount: 20, currency: 'EUR', message: '', status: 'PENDING', createdAt: new Date().toISOString() },
];

function read(): DonationItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(defaultData));
      return [...defaultData];
    }
    return JSON.parse(raw) as DonationItem[];
  } catch (e) {
    return [];
  }
}

function write(items: DonationItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export async function getAllDonations(): Promise<DonationItem[]> {
  return read();
}

export async function createDonation(data: Omit<DonationItem, 'id' | 'createdAt'>): Promise<DonationItem> {
  const items = read();
  const id = 'd' + Math.random().toString(36).slice(2,9);
  const newItem: DonationItem = { id, createdAt: new Date().toISOString(), ...data } as DonationItem;
  items.unshift(newItem);
  write(items);
  return newItem;
}

export async function updateDonation(id: string, data: Partial<DonationItem>): Promise<DonationItem | null> {
  const items = read();
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...data };
  write(items);
  return items[idx];
}

export async function deleteDonation(id: string): Promise<boolean> {
  let items = read();
  const before = items.length;
  items = items.filter(i => i.id !== id);
  write(items);
  return items.length < before;
}
