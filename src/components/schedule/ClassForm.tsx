import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClassEntry, Day, WEEKDAYS, ALL_DAYS, CLASS_COLORS } from '@/types/schedule';
import { Trash2 } from 'lucide-react';

interface ClassFormProps {
  onSave: (entry: Omit<ClassEntry, 'id'>) => void;
  onDelete?: () => void;
  initial?: ClassEntry;
  usedColors: string[];
}

export function ClassForm({ onSave, onDelete, initial, usedColors }: ClassFormProps) {
  const nextColor = CLASS_COLORS.find(c => !usedColors.includes(c.value))?.value ?? CLASS_COLORS[0].value;

  const [name, setName] = useState(initial?.name ?? '');
  const [instructor, setInstructor] = useState(initial?.instructor ?? '');
  const [location, setLocation] = useState(initial?.location ?? '');
  const [days, setDays] = useState<Day[]>(initial?.days ?? []);
  const [startTime, setStartTime] = useState(initial?.startTime ?? '09:00');
  const [endTime, setEndTime] = useState(initial?.endTime ?? '10:00');
  const [color, setColor] = useState(initial?.color ?? nextColor);

  const toggleDay = (day: Day) => {
    setDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || days.length === 0) return;
    onSave({ name: name.trim(), instructor: instructor.trim() || undefined, location: location.trim() || undefined, days, startTime, endTime, color });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="class-name">Class Name *</Label>
        <Input id="class-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Calculus II" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="instructor">Instructor</Label>
          <Input id="instructor" value={instructor} onChange={e => setInstructor(e.target.value)} placeholder="Optional" />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Optional" />
        </div>
      </div>

      <div>
        <Label>Days *</Label>
        <div className="flex flex-wrap gap-2 mt-1.5">
          {ALL_DAYS.map(day => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                days.includes(day)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted text-muted-foreground border-border hover:border-primary/50'
              }`}
              aria-pressed={days.includes(day)}
              aria-label={`${day}${days.includes(day) ? ' (selected)' : ''}`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="start-time">Start Time *</Label>
          <Input id="start-time" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="end-time">End Time *</Label>
          <Input id="end-time" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
        </div>
      </div>

      <div>
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2 mt-1.5">
          {CLASS_COLORS.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => setColor(c.value)}
              className={`h-8 w-8 rounded-full border-2 transition-transform ${
                color === c.value ? 'border-foreground scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: `hsl(${c.value})` }}
              aria-label={`${c.name} color${color === c.value ? ' (selected)' : ''}`}
              aria-pressed={color === c.value}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1 rounded-full" disabled={!name.trim() || days.length === 0}>
          {initial ? 'Update Class' : 'Add Class'}
        </Button>
        {onDelete && (
          <Button type="button" variant="destructive" className="rounded-full" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        )}
      </div>
    </form>
  );
}
