export interface ClassEntry {
  id: string;
  name: string;
  instructor?: string;
  location?: string;
  days: Day[];
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  color: string; // HSL color key
}

export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export const WEEKDAYS: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
export const ALL_DAYS: Day[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CLASS_COLORS = [
  { name: 'Blue', value: '220 90% 56%' },
  { name: 'Rose', value: '350 80% 55%' },
  { name: 'Emerald', value: '160 84% 39%' },
  { name: 'Amber', value: '38 92% 50%' },
  { name: 'Violet', value: '270 76% 53%' },
  { name: 'Cyan', value: '190 90% 45%' },
  { name: 'Orange', value: '25 95% 53%' },
  { name: 'Teal', value: '174 72% 40%' },
  { name: 'Pink', value: '330 80% 60%' },
  { name: 'Indigo', value: '245 58% 51%' },
  { name: 'Lime', value: '85 70% 42%' },
  { name: 'Red', value: '0 72% 51%' },
  { name: 'Sky', value: '200 95% 48%' },
  { name: 'Fuchsia', value: '292 84% 61%' },
  { name: 'Slate', value: '215 20% 45%' },
  { name: 'Gold', value: '45 93% 47%' },
  { name: 'Coral', value: '16 85% 61%' },
  { name: 'Lavender', value: '260 60% 65%' },
  { name: 'Mint', value: '162 63% 55%' },
  { name: 'Peach', value: '28 100% 72%' },
  { name: 'Berry', value: '328 70% 48%' },
  { name: 'Ocean', value: '205 78% 50%' },
  { name: 'Sage', value: '140 30% 52%' },
  { name: 'Mauve', value: '300 25% 55%' },
  { name: 'Periwinkle', value: '232 77% 66%' },
  { name: 'Cerulean', value: '199 89% 57%' },
  { name: 'Apricot', value: '32 95% 68%' },
  { name: 'Terracotta', value: '14 65% 55%' },
  { name: 'Plum', value: '285 45% 48%' },
  { name: 'Aqua', value: '184 75% 48%' },
  { name: 'Olive', value: '78 45% 42%' },
  { name: 'Charcoal', value: '220 14% 32%' },
] as const;

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export function hasConflict(a: ClassEntry, b: ClassEntry): boolean {
  if (a.id === b.id) return false;
  const sharedDays = a.days.filter(d => b.days.includes(d));
  if (sharedDays.length === 0) return false;
  const aStart = timeToMinutes(a.startTime);
  const aEnd = timeToMinutes(a.endTime);
  const bStart = timeToMinutes(b.startTime);
  const bEnd = timeToMinutes(b.endTime);
  return aStart < bEnd && bStart < aEnd;
}
