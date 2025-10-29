export type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string; // ISO
  location: string;
};

const KEY = 'ephahistos_events_v1';

const defaultData: EventItem[] = [
  { id: 'e1', title: 'Spring Picnic', description: 'Fun outdoor picnic with games.', date: new Date().toISOString(), location: 'Central Park' },
  { id: 'e2', title: 'Art Workshop', description: 'Creative painting for kids.', date: new Date().toISOString(), location: 'Community Center' },
];

function read(): EventItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(defaultData));
      return [...defaultData];
    }
    return JSON.parse(raw) as EventItem[];
  } catch (e) {
    return [];
  }
}

function write(items: EventItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export async function getAllEvents(): Promise<EventItem[]> {
  return read();
}

export async function getEvent(id: string): Promise<EventItem | null> {
  const items = read();
  return items.find(i => i.id === id) ?? null;
}

export async function createEvent(data: Omit<EventItem, 'id'>): Promise<EventItem> {
  const items = read();
  const id = 'e' + Math.random().toString(36).slice(2,9);
  const newItem: EventItem = { id, ...data };
  items.unshift(newItem);
  write(items);
  return newItem;
}

export async function updateEvent(id: string, data: Partial<EventItem>): Promise<EventItem | null> {
  const items = read();
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...data };
  write(items);
  return items[idx];
}

export async function deleteEvent(id: string): Promise<boolean> {
  let items = read();
  const before = items.length;
  items = items.filter(i => i.id !== id);
  write(items);
  return items.length < before;
}
