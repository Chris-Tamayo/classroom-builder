import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Share2, Trash2 } from 'lucide-react';
import { useSchedule } from '@/hooks/useSchedule';
import { WEEKDAYS, ALL_DAYS, Day, ClassEntry, timeToMinutes, hasConflict } from '@/types/schedule';
import { ScheduleGrid } from '@/components/schedule/ScheduleGrid';
import { ClassForm } from '@/components/schedule/ClassForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { toPng } from 'html-to-image';

interface ScheduleMakerToolProps {
  /** When true, renders Export & Share buttons inline above the grid (for embedded contexts without app header actions) */
  showInlineActions?: boolean;
}

export const ScheduleMakerTool = ({ showInlineActions = false }: ScheduleMakerToolProps) => {
  const { classes, addClass, updateClass, deleteClass, clearAll } = useSchedule();
  const [showWeekend, setShowWeekend] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassEntry | null>(null);
  const [prefillDay, setPrefillDay] = useState<Day | null>(null);
  const [prefillTime, setPrefillTime] = useState<string | null>(null);
  const [startHour, setStartHour] = useState(7);
  const [endHour, setEndHour] = useState(22);
  const gridRef = useRef<HTMLDivElement>(null);

  const days = showWeekend ? ALL_DAYS : WEEKDAYS;

  const handleSave = (entry: Omit<ClassEntry, 'id'>) => {
    if (editingClass) {
      updateClass(editingClass.id, entry);
      toast.success('Class updated');
    } else {
      addClass(entry);
      toast.success('Class added');
    }
    setFormOpen(false);
    setEditingClass(null);
  };

  const handleEdit = (entry: ClassEntry) => {
    setEditingClass(entry);
    setPrefillDay(null);
    setPrefillTime(null);
    setFormOpen(true);
  };

  const handleSlotClick = (day: Day, time: string) => {
    setEditingClass(null);
    setPrefillDay(day);
    setPrefillTime(time);
    timeToMinutes(time);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteClass(id);
    toast.success('Class removed');
  };

  const handleExportPNG = async () => {
    if (!gridRef.current) return;
    try {
      const dataUrl = await toPng(gridRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        width: gridRef.current.scrollWidth,
        height: gridRef.current.scrollHeight,
        skipAutoScale: true,
      });
      const link = document.createElement('a');
      link.download = 'my-schedule.png';
      link.href = dataUrl;
      link.click();
      toast.success('Schedule exported as PNG');
    } catch {
      toast.error('Export failed');
    }
  };

  const handleShare = () => {
    const data = btoa(JSON.stringify(classes));
    const url = `${window.location.origin}/classroom-schedule-maker?s=${data}`;
    navigator.clipboard.writeText(url);
    toast.success('Shareable link copied to clipboard!');
  };

  const conflicts = new Set<string>();
  classes.forEach((a, i) => {
    classes.forEach((b, j) => {
      if (i < j && hasConflict(a, b)) {
        conflicts.add(a.id);
        conflicts.add(b.id);
      }
    });
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <Dialog open={formOpen} onOpenChange={(open) => { setFormOpen(open); if (!open) { setEditingClass(null); setPrefillDay(null); setPrefillTime(null); } }}>
            <DialogTrigger asChild>
              <Button className="rounded-full shadow-md shadow-primary/20">
                <Plus className="h-4 w-4 mr-1" /> Add Class
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingClass ? 'Edit Class' : 'Add a Class'}</DialogTitle>
              </DialogHeader>
              <ClassForm
                onSave={handleSave}
                onDelete={editingClass ? () => { handleDelete(editingClass.id); setFormOpen(false); setEditingClass(null); } : undefined}
                initial={editingClass ?? undefined}
                usedColors={classes.map(c => c.color)}
                prefillDay={prefillDay ?? undefined}
                prefillTime={prefillTime ?? undefined}
              />
            </DialogContent>
          </Dialog>
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showWeekend}
              onChange={(e) => setShowWeekend(e.target.checked)}
              className="accent-primary h-4 w-4 rounded"
            />
            Show weekends
          </label>
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="start-hour" className="text-muted-foreground">From</label>
            <select id="start-hour" value={startHour} onChange={e => setStartHour(Number(e.target.value))} className="bg-muted border border-border rounded px-2 py-1 text-sm">
              {Array.from({ length: 24 }, (_, i) => i).filter(h => h < endHour).map(h => (
                <option key={h} value={h}>{h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}</option>
              ))}
            </select>
            <label htmlFor="end-hour" className="text-muted-foreground">to</label>
            <select id="end-hour" value={endHour} onChange={e => setEndHour(Number(e.target.value))} className="bg-muted border border-border rounded px-2 py-1 text-sm">
              {Array.from({ length: 24 }, (_, i) => i).filter(h => h > startHour).map(h => (
                <option key={h} value={h}>{h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {showInlineActions && (
            <>
              <Button variant="ghost" size="sm" onClick={handleExportPNG} aria-label="Export as PNG">
                <Download className="h-4 w-4 mr-1" /> Export
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare} aria-label="Copy shareable link" disabled={classes.length === 0}>
                <Share2 className="h-4 w-4 mr-1" /> Share
              </Button>
            </>
          )}
          {classes.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-1" /> Clear All
            </Button>
          )}
        </div>
      </div>

      {conflicts.size > 0 && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
          ⚠️ You have overlapping classes. Check your schedule for time conflicts.
        </div>
      )}

      <div ref={gridRef}>
        <ScheduleGrid
          days={days}
          classes={classes}
          conflicts={conflicts}
          startHour={startHour}
          endHour={endHour}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSlotClick={handleSlotClick}
        />
      </div>
    </div>
  );
};
