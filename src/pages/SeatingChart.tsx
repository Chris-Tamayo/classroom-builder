import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { LayoutGrid, Shuffle, Download, Copy, Lock, Unlock, ArrowRight, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { toPng } from 'html-to-image';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AppHeader from '@/components/AppHeader';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// ── Fisher-Yates Shuffle ──
function fisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Seat {
  id: string;
  studentName: string;
  locked: boolean;
}

type LayoutMode = 'grid' | 'clusters';

const SeatingChart = () => {
  useEffect(() => {
    document.title = 'Free Seating Chart Generator (Classroom Layout Tool) | ClassroomBuilder';
    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('description', 'Create a classroom seating chart in seconds. Free seating chart generator for teachers with drag-and-drop editing, randomization, and PNG export. No login required.');
    setMeta('keywords', 'seating chart generator, classroom seating chart maker, seating chart template, desk layout generator, student seating chart tool');
    setMeta('og:title', 'Free Seating Chart Generator — ClassroomBuilder', 'property');
    setMeta('og:description', 'Create a classroom seating chart in seconds. Drag-and-drop editing, randomization, and PNG export — 100% free.', 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:url', 'https://www.classroombuilder.com/seating-chart-generator', 'property');
    setMeta('twitter:title', 'Free Seating Chart Generator — ClassroomBuilder');
    setMeta('twitter:description', 'Create a classroom seating chart in seconds. Drag-and-drop editing, randomization, and PNG export — 100% free.');

    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Is this seating chart generator free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, completely free. No sign-up, no ads, no limits." } },
        { "@type": "Question", "name": "Can I drag students between seats?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! After generating, drag any student to swap seats. You can also lock specific students in place before randomizing." } },
        { "@type": "Question", "name": "How do I export my seating chart?", "acceptedAnswer": { "@type": "Answer", "text": "Click the Export button to download a high-resolution PNG image, or use Copy to get a text version for pasting into documents." } },
        { "@type": "Question", "name": "What if I have more students than seats?", "acceptedAnswer": { "@type": "Answer", "text": "The tool will show a warning and assign as many students as possible. Increase your rows or columns to add more seats." } },
        { "@type": "Question", "name": "Can I lock a student in a specific seat?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — click the lock icon on any seat to keep that student in place when you hit Randomize." } },
      ]
    });
    document.head.appendChild(ld);

    return () => {
      document.head.removeChild(ld);
      document.title = 'ClassroomBuilder — Free Tools for Teachers & Students';
    };
  }, []);

  const [namesInput, setNamesInput] = useState('');
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(6);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [generated, setGenerated] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('grid');
  const chartRef = useRef<HTMLDivElement>(null);

  const parseNames = useCallback(() => {
    return namesInput
      .split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 0);
  }, [namesInput]);

  const totalSeats = rows * cols;
  const studentNames = parseNames();
  const overflow = studentNames.length > totalSeats;

  const generateChart = useCallback(() => {
    const names = parseNames();
    const shuffled = fisherYatesShuffle(names);
    const newSeats: Seat[] = [];
    for (let i = 0; i < totalSeats; i++) {
      newSeats.push({
        id: `seat-${i}`,
        studentName: i < shuffled.length ? shuffled[i] : '',
        locked: false,
      });
    }
    setSeats(newSeats);
    setGenerated(true);
    toast.success(`Seating chart generated with ${Math.min(names.length, totalSeats)} students`);
  }, [parseNames, totalSeats]);

  const randomizeAgain = useCallback(() => {
    const names = parseNames();
    const lockedSeats = seats.filter(s => s.locked);
    const lockedNames = new Set(lockedSeats.map(s => s.studentName));
    const unlockedNames = names.filter(n => !lockedNames.has(n));
    const shuffled = fisherYatesShuffle(unlockedNames);

    let shuffleIdx = 0;
    const newSeats = seats.map(seat => {
      if (seat.locked) return seat;
      const name = shuffleIdx < shuffled.length ? shuffled[shuffleIdx++] : '';
      return { ...seat, studentName: name };
    });
    setSeats(newSeats);
    toast.success('Seats randomized');
  }, [parseNames, seats]);

  const toggleLock = (id: string) => {
    setSeats(prev => prev.map(s => s.id === id ? { ...s, locked: !s.locked } : s));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const srcIdx = parseInt(result.source.droppableId.replace('seat-', ''));
    const destIdx = parseInt(result.destination.droppableId.replace('seat-', ''));
    if (srcIdx === destIdx) return;
    // Don't allow dropping on locked seats
    if (seats[destIdx].locked) {
      toast.error('That seat is locked');
      return;
    }
    setSeats(prev => {
      const next = [...prev];
      const temp = next[srcIdx].studentName;
      next[srcIdx] = { ...next[srcIdx], studentName: next[destIdx].studentName };
      next[destIdx] = { ...next[destIdx], studentName: temp };
      return next;
    });
  };

  const handleExportPNG = async () => {
    if (!chartRef.current) return;
    try {
      const dataUrl = await toPng(chartRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'seating-chart.png';
      link.href = dataUrl;
      link.click();
      toast.success('Seating chart exported as PNG');
    } catch {
      toast.error('Export failed');
    }
  };

  const handleCopyText = () => {
    const lines: string[] = [];
    for (let r = 0; r < rows; r++) {
      const row = seats.slice(r * cols, (r + 1) * cols);
      lines.push(row.map(s => s.studentName || '(empty)').join('\t'));
    }
    navigator.clipboard.writeText(lines.join('\n'));
    toast.success('Seating chart copied to clipboard');
  };

  const renderGrid = () => {
    if (layoutMode === 'clusters') {
      // Group into clusters of 4 (2x2)
      const clusterCols = Math.ceil(cols / 2);
      const clusterRows = Math.ceil(rows / 2);
      return (
        <div className="flex flex-col gap-6">
          {Array.from({ length: clusterRows }, (_, cr) => (
            <div key={cr} className="flex flex-wrap gap-6 justify-center">
              {Array.from({ length: clusterCols }, (_, cc) => {
                const indices: number[] = [];
                for (let dr = 0; dr < 2; dr++) {
                  for (let dc = 0; dc < 2; dc++) {
                    const r = cr * 2 + dr;
                    const c = cc * 2 + dc;
                    if (r < rows && c < cols) indices.push(r * cols + c);
                  }
                }
                return (
                  <div key={cc} className="grid grid-cols-2 gap-1 p-2 rounded-lg border border-border/60 bg-muted/20">
                    {indices.map(idx => renderSeat(idx))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {seats.map((_, idx) => renderSeat(idx))}
      </div>
    );
  };

  const renderSeat = (idx: number) => {
    const seat = seats[idx];
    if (!seat) return null;
    return (
      <Droppable key={seat.id} droppableId={seat.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`relative min-h-[56px] min-w-[72px] rounded-lg border-2 transition-colors ${
              snapshot.isDraggingOver
                ? 'border-primary bg-primary/10'
                : seat.studentName
                  ? 'border-border bg-card'
                  : 'border-dashed border-border/50 bg-muted/30'
            } ${seat.locked ? 'ring-2 ring-amber-400/60' : ''}`}
          >
            {seat.studentName ? (
              <Draggable draggableId={seat.id} index={0} isDragDisabled={seat.locked}>
                {(dragProvided, dragSnapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    className={`flex items-center justify-center px-2 py-3 text-sm font-medium text-foreground text-center cursor-grab active:cursor-grabbing select-none ${
                      dragSnapshot.isDragging ? 'opacity-80 shadow-lg scale-105' : ''
                    }`}
                  >
                    {seat.studentName}
                  </div>
                )}
              </Draggable>
            ) : (
              <div className="flex items-center justify-center px-2 py-3 text-xs text-muted-foreground/50">
                —
              </div>
            )}
            {provided.placeholder}
            {seat.studentName && (
              <button
                onClick={() => toggleLock(seat.id)}
                className="absolute top-0.5 right-0.5 p-0.5 rounded text-muted-foreground/50 hover:text-foreground transition-colors"
                aria-label={seat.locked ? 'Unlock seat' : 'Lock seat'}
              >
                {seat.locked ? <Lock className="h-3 w-3 text-amber-500" /> : <Unlock className="h-3 w-3" />}
              </button>
            )}
          </div>
        )}
      </Droppable>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        actions={
          generated ? (
            <>
              <Button variant="ghost" size="sm" onClick={handleExportPNG} aria-label="Export as PNG">
                <Download className="h-4 w-4 mr-1" /> Export
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCopyText} aria-label="Copy to clipboard">
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
            </>
          ) : undefined
        }
      />

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* H1 + Intro */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <LayoutGrid className="h-8 w-8 text-primary" aria-hidden="true" />
            <h1 className="text-3xl font-bold sm:text-4xl">Free Seating Chart Generator for Teachers</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-sm">
            Create a classroom seating chart in seconds. Paste your student names, choose your layout, and click Generate. Drag students between seats to fine-tune, lock specific seats, and export as a PNG image or copy to clipboard. No login, no sign-up — 100% free.
          </p>
        </header>

        {/* Tool Section */}
        <div className="grid md:grid-cols-[320px_1fr] gap-6 mb-8">
          {/* Left Panel — Input */}
          <Card className="h-fit">
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="names-input">Student Names (one per line)</Label>
                <Textarea
                  id="names-input"
                  value={namesInput}
                  onChange={(e) => setNamesInput(e.target.value)}
                  placeholder={"Alice Johnson\nBob Smith\nCarla Davis\n..."}
                  className="mt-1.5 min-h-[160px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {studentNames.length} student{studentNames.length !== 1 ? 's' : ''} detected
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="rows-input">Rows</Label>
                  <Input id="rows-input" type="number" min={1} max={20} value={rows} onChange={e => setRows(Math.max(1, Math.min(20, Number(e.target.value))))} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="cols-input">Columns</Label>
                  <Input id="cols-input" type="number" min={1} max={20} value={cols} onChange={e => setCols(Math.max(1, Math.min(20, Number(e.target.value))))} className="mt-1" />
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                {totalSeats} total seats ({rows} × {cols})
              </p>

              <div>
                <Label>Layout Style</Label>
                <RadioGroup value={layoutMode} onValueChange={(v) => setLayoutMode(v as LayoutMode)} className="flex gap-4 mt-1.5">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="grid" id="layout-grid" />
                    <Label htmlFor="layout-grid" className="cursor-pointer font-normal">Rows</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="clusters" id="layout-clusters" />
                    <Label htmlFor="layout-clusters" className="cursor-pointer font-normal">Clusters (2×2)</Label>
                  </div>
                </RadioGroup>
              </div>

              {overflow && (
                <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive" role="alert">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{studentNames.length} students but only {totalSeats} seats. Increase rows or columns.</span>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={generateChart} className="flex-1 rounded-full" disabled={studentNames.length === 0}>
                  <Shuffle className="h-4 w-4 mr-1" /> Generate
                </Button>
              </div>

              {generated && (
                <Button variant="outline" onClick={randomizeAgain} className="w-full rounded-full">
                  <Shuffle className="h-4 w-4 mr-1" /> Randomize Again
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Right Panel — Chart */}
          <div>
            {!generated ? (
              <div className="flex items-center justify-center h-full min-h-[300px] rounded-xl border-2 border-dashed border-border/50 bg-muted/10">
                <div className="text-center text-muted-foreground">
                  <LayoutGrid className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Your seating chart will appear here</p>
                  <p className="text-sm mt-1">Paste names and click Generate to start</p>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Teacher desk indicator */}
                <div className="flex justify-center mb-4">
                  <div className="px-8 py-2 rounded-lg bg-muted border border-border text-sm font-medium text-muted-foreground">
                    Front of Classroom / Teacher's Desk
                  </div>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <div ref={chartRef} className="p-4 rounded-xl border bg-card">
                    {renderGrid()}
                  </div>
                </DragDropContext>
              </motion.div>
            )}
          </div>
        </div>

        {/* SEO Content */}
        <section className="mt-16 space-y-10 text-sm text-muted-foreground leading-relaxed max-w-4xl mx-auto" aria-label="About the seating chart generator">

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">How to Create a Seating Chart</h2>
            <p className="mb-2">
              Creating a seating chart has never been easier. Simply paste your student names (one per line) into the text box, choose the number of rows and columns to match your classroom desks, and click <strong>Generate</strong>.
            </p>
            <p className="mb-2">
              The tool randomly assigns students to seats using a Fisher-Yates shuffle for perfectly fair randomization. Once generated, you can <strong>drag and drop</strong> any student to a different seat to accommodate special needs, behavior management, or grouping preferences.
            </p>
            <p>
              Need to keep certain students in their assigned seats? Click the <strong>lock icon</strong> on any seat, then hit <strong>Randomize Again</strong> — locked students stay put while everyone else gets shuffled. Export your final chart as a <strong>PNG image</strong> to print, email, or post in your classroom.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">Classroom Seating Chart Ideas</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Traditional rows:</strong> Use a standard grid layout (e.g., 5 rows × 6 columns) for lecture-based classrooms or standardized testing setups.</li>
              <li><strong>Clusters of 4:</strong> Switch to the cluster layout to group desks in pods of four — ideal for collaborative learning and group projects.</li>
              <li><strong>Randomize weekly:</strong> Re-shuffle seats every week or month to encourage new friendships and prevent cliques from forming.</li>
              <li><strong>Strategic placement:</strong> Lock students who need front-row seating (for vision, hearing, or focus), then randomize the rest.</li>
              <li><strong>Flexible seating zones:</strong> Create a larger grid with empty seats to designate reading nooks, standing desks, or breakout areas.</li>
              <li><strong>Sub plans:</strong> Export your seating chart as a PNG and include it in substitute teacher instructions so they can identify students quickly.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">Benefits of Using a Seating Chart Generator</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Save time:</strong> Generate a randomized chart in under 10 seconds instead of manually arranging names on paper or spreadsheets.</li>
              <li><strong>Fair randomization:</strong> Fisher-Yates ensures every student has an equal chance of being in any seat — no bias, no favoritism.</li>
              <li><strong>Manage behavior:</strong> Strategically place students by locking certain seats, then let the tool handle the rest. Separate talkative pairs effortlessly.</li>
              <li><strong>Drag-and-drop flexibility:</strong> Fine-tune the generated chart by dragging students between seats — no need to regenerate from scratch.</li>
              <li><strong>Multiple layouts:</strong> Choose between traditional rows and cluster pods to match your classroom furniture arrangement.</li>
              <li><strong>PNG export:</strong> Download a clean, printable image of your seating chart for your classroom door, lesson planner, or digital records.</li>
              <li><strong>100% private:</strong> All data stays in your browser — student names are never uploaded to any server.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="faq-1">
                <AccordionTrigger className="text-foreground text-left">Is this seating chart generator free?</AccordionTrigger>
                <AccordionContent>
                  Yes, completely free. No sign-up, no ads, no limits. Create as many seating charts as you need.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger className="text-foreground text-left">Can I drag students between seats?</AccordionTrigger>
                <AccordionContent>
                  Yes! After generating your chart, simply drag any student's name to another seat to swap them. This makes it easy to fine-tune your arrangement without starting over.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-3">
                <AccordionTrigger className="text-foreground text-left">How do I export my seating chart?</AccordionTrigger>
                <AccordionContent>
                  Click the <strong>Export</strong> button in the header to download your chart as a high-resolution PNG image. You can also click <strong>Copy</strong> to get a text version for pasting into documents or emails.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-4">
                <AccordionTrigger className="text-foreground text-left">What if I have more students than seats?</AccordionTrigger>
                <AccordionContent>
                  The tool will show a warning and assign as many students as possible to the available seats. Simply increase the number of rows or columns to add more seats.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-5">
                <AccordionTrigger className="text-foreground text-left">Can I lock a student in a specific seat?</AccordionTrigger>
                <AccordionContent>
                  Yes — click the lock icon on any seat to keep that student in place. When you hit <strong>Randomize Again</strong>, locked students stay put while everyone else gets shuffled.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-6" className="border-b-0">
                <AccordionTrigger className="text-foreground text-left">Is my student data private?</AccordionTrigger>
                <AccordionContent>
                  Absolutely. All processing happens entirely in your browser. No data is sent to any server — your student names never leave your device.
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
            <div className="grid sm:grid-cols-3 gap-4">
              <Link to="/random-group-generator" className="group block rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  Random Group Generator
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Split your class into fair, randomized groups with drag-and-drop editing and CSV export.
                </p>
              </Link>
              <Link to="/random-name-picker" className="group block rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  Random Name Picker
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Randomly pick students with a fun spin animation. Great for participation.
                </p>
              </Link>
              <Link to="/classroom-schedule-maker" className="group block rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  Schedule Builder
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Build a color-coded weekly class schedule with PNG export and sharing.
                </p>
              </Link>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
};

export default SeatingChart;