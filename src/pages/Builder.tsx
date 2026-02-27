import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Download, Share2, Trash2, ArrowRight } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useSchedule } from '@/hooks/useSchedule';
import { WEEKDAYS, ALL_DAYS, Day, ClassEntry, CLASS_COLORS, timeToMinutes, formatTime, hasConflict } from '@/types/schedule';
import { ScheduleGrid } from '@/components/schedule/ScheduleGrid';
import { ClassForm } from '@/components/schedule/ClassForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AppHeader from '@/components/AppHeader';

const Builder = () => {
  useEffect(() => {
    document.title = 'Free Class Schedule Maker — Build Your Weekly Schedule | ClassroomBuilder';
    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('description', 'Free class schedule maker for students and teachers. Build a color-coded weekly schedule with conflict detection, PNG export, and shareable links. No sign-up required.');
    setMeta('keywords', 'class schedule maker, weekly schedule builder, student schedule maker, free schedule creator, college schedule builder, class timetable maker');
    setMeta('og:title', 'Free Class Schedule Maker — ClassroomBuilder', 'property');
    setMeta('og:description', 'Build a color-coded weekly class schedule in seconds. Export, share, and print — 100% free.', 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:url', 'https://classroombuilder.com/builder', 'property');
    setMeta('twitter:title', 'Free Class Schedule Maker — ClassroomBuilder');
    setMeta('twitter:description', 'Build a color-coded weekly class schedule in seconds. Export, share, and print — 100% free.');

    return () => {
      document.title = 'ClassroomBuilder — Free Tools for Teachers & Students';
    };
  }, []);

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

      <main className="container mx-auto px-4 py-6 max-w-6xl">

        {/* ─── Above the Tool: H1 + Intro ─── */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Calendar className="h-8 w-8 text-primary" aria-hidden="true" />
            <h1 className="text-3xl font-bold sm:text-4xl">Free Class Schedule Maker</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-sm">
            Plan your perfect week with this free class schedule maker. Add your classes with times, days, locations, and instructor names — then see everything on a clean, color-coded weekly grid. Built for students registering for courses and teachers organizing their teaching load, this tool makes schedule planning visual and effortless. Export as PNG, share with a link, and catch time conflicts before they happen. No account needed.
          </p>
        </header>

        {/* ─── Tool Section ─── */}
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

        {/* ─── Below the Tool: SEO Content ─── */}
        <section className="mt-16 space-y-10 text-sm text-muted-foreground leading-relaxed max-w-4xl mx-auto" aria-label="About the class schedule maker">

          {/* How It Works */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">How Does This Schedule Maker Work?</h2>
            <p className="mb-2">
              Click <strong>Add Class</strong> and enter the class name, instructor, time, days, and location. The schedule maker places your class on a color-coded weekly grid so you can see your entire week at a glance.
            </p>
            <p className="mb-2">
              The tool automatically detects <strong>time conflicts</strong> — if two classes overlap on the same day, you'll see a warning so you can fix it before finalizing your schedule.
            </p>
            <p>
              When you're happy with your schedule, export it as a <strong>PNG image</strong> to save or print, or generate a <strong>shareable link</strong> to send to classmates, advisors, or parents.
            </p>
          </div>

          {/* Use Cases */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">Use Cases for Students & Teachers</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Course registration planning:</strong> Map out potential class schedules before registration opens to find the best combination.</li>
              <li><strong>Comparing schedule options:</strong> Build multiple schedules and share links to compare with friends or advisors.</li>
              <li><strong>Teaching load visualization:</strong> Teachers can plot their classes, office hours, and meetings on one grid.</li>
              <li><strong>Tutoring schedules:</strong> Tutors and TAs can organize their sessions across the week.</li>
              <li><strong>Extracurricular planning:</strong> Add clubs, sports, and study sessions alongside classes to see your full week.</li>
              <li><strong>Parent communication:</strong> Share a PNG of your schedule with parents so they know when you're in class.</li>
            </ul>
          </div>

          {/* Benefits */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">Why Use ClassroomBuilder's Schedule Maker?</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Visual & color-coded:</strong> Each class gets its own color, making your week easy to scan at a glance.</li>
              <li><strong>Conflict detection:</strong> Instantly spot overlapping classes before you commit to your schedule.</li>
              <li><strong>Flexible hours:</strong> Adjust the visible time range from early morning to late evening to match your needs.</li>
              <li><strong>Weekend support:</strong> Toggle Saturday and Sunday columns for students with weekend classes or activities.</li>
              <li><strong>PNG export & sharing:</strong> Download a clean image or share a link — perfect for printing, posting, or texting.</li>
              <li><strong>100% free & private:</strong> No account required. Your schedule is saved in your browser and never uploaded.</li>
            </ul>
          </div>

          {/* FAQs */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="faq-1">
                <AccordionTrigger className="text-foreground text-left">Is this schedule maker free?</AccordionTrigger>
                <AccordionContent>
                  Yes, completely free. No sign-up, no ads, no limits. Build as many schedules as you want.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger className="text-foreground text-left">Will my schedule be saved?</AccordionTrigger>
                <AccordionContent>
                  Your schedule is saved in your browser's local storage, so it persists between visits on the same device. You can also export a shareable link to access it anywhere.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-3">
                <AccordionTrigger className="text-foreground text-left">Can I share my schedule with someone?</AccordionTrigger>
                <AccordionContent>
                  Yes! Click the <strong>Share</strong> button to copy a link that contains your entire schedule. Anyone who opens the link will see your schedule — no account needed on their end either.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-4">
                <AccordionTrigger className="text-foreground text-left">How do I print my schedule?</AccordionTrigger>
                <AccordionContent>
                  Click <strong>Export</strong> to download your schedule as a high-resolution PNG image. You can then print it directly or paste it into a document.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-5">
                <AccordionTrigger className="text-foreground text-left">Does it detect schedule conflicts?</AccordionTrigger>
                <AccordionContent>
                  Yes. If two classes overlap on the same day, the tool highlights them and shows a warning banner so you can resolve the conflict.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-6">
                <AccordionTrigger className="text-foreground text-left">Can I add weekend classes?</AccordionTrigger>
                <AccordionContent>
                  Yes — check the "Show weekends" box to add Saturday and Sunday columns to your schedule grid.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Internal Links */}
          <div className="border-t border-border pt-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">More Free Teacher & Student Tools</h2>
            <p className="mb-4">
              ClassroomBuilder offers a growing set of free tools designed for teachers and students. Check out our other tools:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link to="/random-group-generator" className="group block rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  Random Group Generator
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Split your class into fair, randomized groups with smart pair avoidance. Drag-and-drop editing and CSV export — free for teachers.
                </p>
              </Link>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
};

export default Builder;
