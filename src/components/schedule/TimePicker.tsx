import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface TimePickerProps {
  value: string; // HH:mm
  onChange: (value: string) => void;
  label: string;
  id: string;
}

function formatTimeLabel(h: number, m: number): string {
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

const TIME_OPTIONS: { value: string; label: string }[] = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 15) {
    const val = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    TIME_OPTIONS.push({ value: val, label: formatTimeLabel(h, m) });
  }
}

function parseTimeInput(input: string): string | null {
  // Try to parse various formats: "10:20 pm", "10:20pm", "1020pm", "22:20", etc.
  const cleaned = input.trim().toLowerCase();
  
  // Match patterns like "10:20 pm", "10:20pm", "1:30 am"
  const match12 = cleaned.match(/^(\d{1,2}):?(\d{2})\s*(am|pm)$/);
  if (match12) {
    let h = parseInt(match12[1]);
    const m = parseInt(match12[2]);
    const period = match12[3];
    if (m > 59 || h > 12 || h < 1) return null;
    if (period === 'pm' && h !== 12) h += 12;
    if (period === 'am' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }
  
  // Match 24h format "22:20", "9:05"
  const match24 = cleaned.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const h = parseInt(match24[1]);
    const m = parseInt(match24[2]);
    if (h > 23 || m > 59) return null;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }
  
  return null;
}

export function TimePicker({ value, onChange, label, id }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentLabel = (() => {
    const [h, m] = value.split(':').map(Number);
    return formatTimeLabel(h, m);
  })();

  useEffect(() => {
    if (open && listRef.current && !typing) {
      const selected = listRef.current.querySelector('[data-selected="true"]');
      if (selected) {
        selected.scrollIntoView({ block: 'center' });
      }
    }
  }, [open, typing]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setTyping(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const parsed = parseTimeInput(inputValue);
      if (parsed) {
        onChange(parsed);
        setOpen(false);
        setTyping(false);
      }
    } else if (e.key === 'Escape') {
      setTyping(false);
      setOpen(false);
    }
  };

  const handleInputBlur = () => {
    if (inputValue) {
      const parsed = parseTimeInput(inputValue);
      if (parsed) {
        onChange(parsed);
      }
    }
    // Small delay so clicking a dropdown option still works
    setTimeout(() => setTyping(false), 150);
  };

  const filteredOptions = typing && inputValue
    ? TIME_OPTIONS.filter(opt => opt.label.toLowerCase().includes(inputValue.toLowerCase()))
    : TIME_OPTIONS;

  return (
    <div ref={containerRef} className="relative">
      {typing ? (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
          placeholder="e.g. 10:20 PM"
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
          )}
          autoFocus
        />
      ) : (
        <button
          type="button"
          id={id}
          onClick={() => { setOpen(!open); }}
          onDoubleClick={() => { setTyping(true); setInputValue(''); setOpen(true); }}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'hover:bg-accent/50 transition-colors'
          )}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={`${label}: ${currentLabel}`}
        >
          <span>{currentLabel}</span>
          <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', open && 'rotate-180')} />
        </button>
      )}
      {open && (
        <div
          ref={listRef}
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md animate-in fade-in-0 zoom-in-95"
        >
          {!typing && (
            <button
              type="button"
              onClick={() => { setTyping(true); setInputValue(''); }}
              className="flex w-full items-center rounded-sm px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer border-b border-border mb-1"
            >
              Type a custom time…
            </button>
          )}
          {filteredOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={opt.value === value}
              data-selected={opt.value === value}
              onClick={() => { onChange(opt.value); setOpen(false); setTyping(false); }}
              className={cn(
                'flex w-full items-center rounded-sm px-3 py-1.5 text-sm cursor-pointer transition-colors',
                opt.value === value
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
