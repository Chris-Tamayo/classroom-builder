import { useMemo } from 'react';
import { Day, ClassEntry, timeToMinutes, formatTime } from '@/types/schedule';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScheduleGridProps {
  days: Day[];
  classes: ClassEntry[];
  conflicts: Set<string>;
  onEdit: (entry: ClassEntry) => void;
  onDelete: (id: string) => void;
}

const HOUR_HEIGHT = 60; // px per hour
const START_HOUR = 7;
const END_HOUR = 22;

export function ScheduleGrid({ days, classes, conflicts, onEdit, onDelete }: ScheduleGridProps) {
  const hours = useMemo(() => {
    const arr: number[] = [];
    for (let h = START_HOUR; h <= END_HOUR; h++) arr.push(h);
    return arr;
  }, []);

  const totalHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

  const getBlockStyle = (entry: ClassEntry) => {
    const startMin = timeToMinutes(entry.startTime);
    const endMin = timeToMinutes(entry.endTime);
    const top = ((startMin - START_HOUR * 60) / 60) * HOUR_HEIGHT;
    const height = ((endMin - startMin) / 60) * HOUR_HEIGHT;
    return { top: `${top}px`, height: `${Math.max(height, 20)}px` };
  };

  return (
    <div className="overflow-x-auto rounded-xl border bg-card shadow-sm" role="table" aria-label="Weekly class schedule">
      <div className="min-w-[600px]">
        {/* Header */}
        <div className="grid border-b bg-muted/30" style={{ gridTemplateColumns: `64px repeat(${days.length}, 1fr)` }} role="row">
          <div className="p-3 text-xs font-medium text-muted-foreground border-r" role="columnheader">Time</div>
          {days.map(day => (
            <div key={day} className="p-3 text-center text-sm font-semibold border-r last:border-r-0" role="columnheader">
              {day}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="grid" style={{ gridTemplateColumns: `64px repeat(${days.length}, 1fr)` }}>
          {/* Time labels */}
          <div className="relative border-r" style={{ height: `${totalHeight}px` }}>
            {hours.map(h => (
              <div
                key={h}
                className="absolute left-0 right-0 flex items-start px-2 text-[11px] text-muted-foreground -translate-y-2"
                style={{ top: `${(h - START_HOUR) * HOUR_HEIGHT}px` }}
              >
                {h === 0 ? '12 AM' : h <= 12 ? `${h} ${h < 12 ? 'AM' : 'PM'}` : `${h - 12} PM`}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map(day => {
            const dayClasses = classes.filter(c => c.days.includes(day));
            return (
              <div key={day} className="relative border-r last:border-r-0" style={{ height: `${totalHeight}px` }}>
                {/* Hour lines */}
                {hours.map(h => (
                  <div
                    key={h}
                    className="absolute left-0 right-0 border-t border-border/40"
                    style={{ top: `${(h - START_HOUR) * HOUR_HEIGHT}px` }}
                  />
                ))}

                {/* Class blocks */}
                <AnimatePresence>
                  {dayClasses.map(entry => {
                    const style = getBlockStyle(entry);
                    const isConflict = conflicts.has(entry.id);
                    return (
                      <motion.button
                        key={entry.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          'absolute left-1 right-1 rounded-lg px-2 py-1 text-left cursor-pointer overflow-hidden transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
                          isConflict && 'ring-2 ring-destructive ring-offset-1'
                        )}
                        style={{
                          top: style.top,
                          height: style.height,
                          backgroundColor: `hsl(${entry.color} / 0.85)`,
                          color: 'white',
                        }}
                        onClick={() => onEdit(entry)}
                        aria-label={`${entry.name}, ${formatTime(entry.startTime)} to ${formatTime(entry.endTime)}${entry.location ? `, at ${entry.location}` : ''}. Click to edit.`}
                      >
                        <span className="block text-xs font-semibold truncate drop-shadow-sm">{entry.name}</span>
                        <span className="block text-[10px] opacity-90 truncate drop-shadow-sm">
                          {formatTime(entry.startTime)} – {formatTime(entry.endTime)}
                        </span>
                        {entry.location && (
                          <span className="block text-[10px] opacity-80 truncate">{entry.location}</span>
                        )}
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
