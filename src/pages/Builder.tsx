import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Download, Share2, Trash2 } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useSchedule } from '@/hooks/useSchedule';
import { WEEKDAYS, ALL_DAYS, Day, ClassEntry, CLASS_COLORS, timeToMinutes, formatTime, hasConflict } from '@/types/schedule';
import { ScheduleGrid } from '@/components/schedule/ScheduleGrid';
import { ClassForm } from '@/components/schedule/ClassForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '@/components/AppHeader';

const Builder = () => {
  const { theme, toggle } = useTheme();
  const { classes, addClass, updateClass, deleteClass, clearAll } = useSchedule();
  const [showWeekend, setShowWeekend] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassEntry | null>(null);
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
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteClass(id);
    toast.success('Class removed');
  };

  const handleExportPNG = async () => {
    if (!gridRef.current) return;
    try {
      const canvas = await html2canvas(gridRef.current, { backgroundColor: null, scale: 2 });
      const link = document.createElement('a');
      link.download = 'my-schedule.png';
      link.href = canvas.toDataURL();
      link.click();
      toast.success('Schedule exported as PNG');
    } catch {
      toast.error('Export failed');
    }
  };

  const handleShare = () => {
    const data = btoa(JSON.stringify(classes));
    const url = `${window.location.origin}/builder?s=${data}`;
    navigator.clipboard.writeText(url);
    toast.success('Shareable link copied to clipboard!');
  };

  // Load shared schedule from URL
  useState(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('s');
    if (shared && classes.length === 0) {
      try {
        const decoded: ClassEntry[] = JSON.parse(atob(shared));
        decoded.forEach(c => addClass({ ...c }));
      } catch { /* ignore */ }
    }
  });

  // Find conflicts
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
    <div className="min-h-screen bg-background">
      <AppHeader
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={handleExportPNG} aria-label="Export as PNG">
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare} aria-label="Copy shareable link" disabled={classes.length === 0}>
              <Share2 className="h-4 w-4 mr-1" /> Share
            </Button>
          </>
        }
      />

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Dialog open={formOpen} onOpenChange={(open) => { setFormOpen(open); if (!open) setEditingClass(null); }}>
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
          {classes.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-1" /> Clear All
            </Button>
          )}
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
          />
        </div>
      </main>
    </div>
  );
};

export default Builder;
