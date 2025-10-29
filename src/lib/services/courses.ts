export type CourseItem = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  capacity: number;
};

const KEY = 'ephahistos_courses_v1';

const defaultData: CourseItem[] = [
  { id: 'c1', title: 'Beginner Math', description: 'Math for primary kids', startDate: new Date().toISOString(), endDate: new Date().toISOString(), capacity: 12 },
  { id: 'c2', title: 'Music Class', description: 'Singing and instruments', startDate: new Date().toISOString(), endDate: new Date().toISOString(), capacity: 8 },
];

function read(): CourseItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(defaultData));
      return [...defaultData];
    }
    return JSON.parse(raw) as CourseItem[];
  } catch (e) {
    return [];
  }
}

function write(items: CourseItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export async function getAllCourses(): Promise<CourseItem[]> {
  return read();
}

export async function createCourse(data: Omit<CourseItem, 'id'>): Promise<CourseItem> {
  const items = read();
  const id = 'c' + Math.random().toString(36).slice(2,9);
  const newItem: CourseItem = { id, ...data };
  items.unshift(newItem);
  write(items);
  return newItem;
}

export async function updateCourse(id: string, data: Partial<CourseItem>): Promise<CourseItem | null> {
  const items = read();
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...data };
  write(items);
  return items[idx];
}

export async function deleteCourse(id: string): Promise<boolean> {
  let items = read();
  const before = items.length;
  items = items.filter(i => i.id !== id);
  write(items);
  return items.length < before;
}
