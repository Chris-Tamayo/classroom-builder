import { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Shuffle, Copy, RotateCcw, Trash2, Upload, Dices, ArrowRight, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AppHeader from '@/components/AppHeader';

// ── Fisher-Yates Shuffle ──────────────────────────
function fisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const STORAGE_KEY = 'classroombuilder-name-picker-list';

function loadNames(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

function saveNames(raw: string) {
  localStorage.setItem(STORAGE_KEY, raw);
}

const SPIN_DURATION = 1600; // ms
const SPIN_INTERVAL = 60; // ms between name flashes

const EXAMPLE_NAMES = `Emma\nLiam\nSophia\nNoah\nAva\nOliver\nIsabella\nLucas\nMia\nElijah`;

const PICK_COUNTS = [1, 2, 3, 5];

const RandomNamePicker = () => {
  const [rawNames, setRawNames] = useState(loadNames);
  const [pool, setPool] = useState<string[]>([]);
  const [pickedNames, setPickedNames] = useState<string[]>([]);
  const [removed, setRemoved] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinDisplay, setSpinDisplay] = useState<string | null>(null);
  const [wheelMode, setWheelMode] = useState(true);
  const [pickCount, setPickCount] = useState(1);
  const spinRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Parse names from textarea
  const parseNames = useCallback((raw: string) => {
    return raw
      .split(/[\n,]/)
      .map((n) => n.trim())
      .filter(Boolean);
  }, []);

  // Initialize pool when rawNames changes
  useEffect(() => {
    const names = parseNames(rawNames);
    setPool(names.filter((n) => !removed.includes(n)));
  }, [rawNames, removed, parseNames]);

  // Save to localStorage
  useEffect(() => {
    saveNames(rawNames);
  }, [rawNames]);

  // SEO meta tags
  useEffect(() => {
    document.title = 'Random Name Picker for Teachers – Free Student Name Picker';
    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('description', 'Free random name picker for teachers. Paste your class list and instantly pick a student at random. Perfect for classroom participation, presentations, and games.');
    setMeta('keywords', 'random name picker, student name picker, classroom name picker, random student selector, teacher tools');
    setMeta('og:title', 'Random Name Picker for Teachers – Free Student Name Picker', 'property');
    setMeta('og:description', 'Free random name picker for teachers. Paste your class list and instantly pick a student at random.', 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:url', 'https://www.classroombuilder.com/random-name-picker', 'property');
    setMeta('twitter:title', 'Random Name Picker for Teachers – Free Student Name Picker');
    setMeta('twitter:description', 'Free random name picker for teachers. Paste your class list and instantly pick a student at random.');

    // JSON-LD
    const jsonLd = document.createElement('script');
    jsonLd.type = 'application/ld+json';
    jsonLd.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is the name picker truly random?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We use the Fisher-Yates shuffle algorithm, the gold standard for unbiased randomization.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I remove names after they are picked?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Absolutely. After a name is picked you can remove it from the pool so it won\'t be selected again.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is student data stored anywhere?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. All data stays in your browser via localStorage. Nothing is sent to any server.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I use this for groups or games?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Use it for picking volunteers, assigning roles, classroom games, or any scenario where you need a random selection. For full group generation, try our Random Group Generator.',
          },
        },
      ],
    });
    document.head.appendChild(jsonLd);
    return () => {
      document.head.removeChild(jsonLd);
    };
  }, []);

  const actualPickCount = Math.min(pickCount, pool.length);

  const pickRandom = useCallback(() => {
    if (pool.length === 0) {
      toast.error('No names in the pool');
      return;
    }

    const count = Math.min(pickCount, pool.length);

    if (wheelMode && count === 1) {
      // Spin animation (single pick only)
      setIsSpinning(true);
      const shuffled = fisherYatesShuffle(pool);
      let tick = 0;
      const totalTicks = Math.floor(SPIN_DURATION / SPIN_INTERVAL);

      spinRef.current = setInterval(() => {
        tick++;
        const idx = Math.floor(Math.random() * pool.length);
        setSpinDisplay(pool[idx]);

        if (tick >= totalTicks) {
          if (spinRef.current) clearInterval(spinRef.current);
          setSpinDisplay(null);
          setPickedNames([shuffled[0]]);
          setIsSpinning(false);
        }
      }, SPIN_INTERVAL);
    } else {
      const shuffled = fisherYatesShuffle(pool);
      setPickedNames(shuffled.slice(0, count));
    }
  }, [pool, wheelMode, pickCount]);

  const removePicked = useCallback(() => {
    if (pickedNames.length > 0) {
      setRemoved((prev) => [...prev, ...pickedNames]);
      setPickedNames([]);
      toast.success(`${pickedNames.length === 1 ? pickedNames[0] : `${pickedNames.length} names`} removed from pool`);
    }
  }, [pickedNames]);

  const removeSinglePicked = useCallback((name: string) => {
    setRemoved((prev) => [...prev, name]);
    setPickedNames((prev) => prev.filter((n) => n !== name));
    toast.success(`${name} removed from pool`);
  }, []);

  const resetAll = useCallback(() => {
    setRemoved([]);
    setPickedNames([]);
    setSpinDisplay(null);
    toast.success('List reset — all names restored');
  }, []);

  const shufflePool = useCallback(() => {
    const names = parseNames(rawNames);
    const available = names.filter((n) => !removed.includes(n));
    setPool(fisherYatesShuffle(available));
    toast.success('List shuffled');
  }, [rawNames, removed, parseNames]);

  const copyResult = useCallback(() => {
    if (pickedNames.length > 0) {
      navigator.clipboard.writeText(pickedNames.join('\n'));
      toast.success('Copied to clipboard');
    }
  }, [pickedNames]);

  const handleCSVImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        if (text) {
          // Parse CSV: take first column of each row, skip empty
          const names = text
            .split(/[\n\r]+/)
            .map((line) => line.split(',')[0]?.trim())
            .filter(Boolean);
          setRawNames(names.join('\n'));
          setRemoved([]);
          setPickedName(null);
          toast.success(`${names.length} names imported`);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  const availableCount = pool.length;
  const totalCount = parseNames(rawNames).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 inset-x-0 z-50">
        <AppHeader />
      </div>

      <main className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Random Name Picker for the Classroom
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Paste your class list below and instantly pick a student at random. Perfect for classroom
            participation, presentations, group activities, and games. All data stays in your browser — no
            accounts, no tracking.
          </p>
        </motion.div>

        {/* Tool */}
        <Card className="mb-8">
          <CardContent className="p-6 space-y-6">
            {/* Input */}
            <div>
              <label htmlFor="names-input" className="block text-sm font-medium mb-2">
                Student Names <span className="text-muted-foreground">(one per line or comma-separated)</span>
              </label>
              <Textarea
                id="names-input"
                placeholder={"Alice Johnson\nBob Smith\nCarla Davis\n..."}
                value={rawNames}
                onChange={(e) => {
                  setRawNames(e.target.value);
                  setRemoved([]);
                  setPickedName(null);
                }}
                rows={6}
                className="font-mono text-sm"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {availableCount} of {totalCount} names available
                </span>
                <Button variant="ghost" size="sm" onClick={handleCSVImport} className="text-xs">
                  <Upload className="h-3.5 w-3.5 mr-1" /> Import CSV
                </Button>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={pickRandom}
                disabled={availableCount === 0 || isSpinning}
                className="rounded-full px-6 shadow-lg shadow-primary/20"
                size="lg"
              >
                <Dices className="h-5 w-5 mr-2" />
                {isSpinning ? 'Picking...' : 'Pick a Random Name'}
              </Button>

              <Button variant="outline" size="sm" onClick={shufflePool} disabled={availableCount === 0}>
                <Shuffle className="h-4 w-4 mr-1" /> Shuffle
              </Button>
              <Button variant="outline" size="sm" onClick={resetAll}>
                <RotateCcw className="h-4 w-4 mr-1" /> Reset
              </Button>
              <label className="inline-flex items-center gap-2 text-sm text-muted-foreground ml-auto cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={wheelMode}
                  onChange={(e) => setWheelMode(e.target.checked)}
                  className="rounded border-input"
                />
                Spin animation
              </label>
            </div>

            {/* Result display */}
            <AnimatePresence mode="wait">
              {(pickedName || spinDisplay) && (
                <motion.div
                  key={spinDisplay || pickedName}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="relative rounded-2xl bg-primary/10 border-2 border-primary/30 p-8 md:p-12 text-center"
                >
                  {isSpinning ? (
                    <p className="text-3xl md:text-5xl font-bold text-primary animate-pulse">
                      {spinDisplay}
                    </p>
                  ) : (
                    <>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                        Selected Student
                      </p>
                      <p className="text-4xl md:text-6xl font-bold text-primary mb-6">
                        {pickedName}
                      </p>
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        <Button variant="outline" size="sm" onClick={copyResult}>
                          <Copy className="h-4 w-4 mr-1" /> Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={removePicked}>
                          <UserX className="h-4 w-4 mr-1" /> Remove from Pool
                        </Button>
                        <Button size="sm" onClick={pickRandom} disabled={availableCount <= 1}>
                          <Dices className="h-4 w-4 mr-1" /> Pick Again
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Removed names */}
            {removed.length > 0 && (
              <div className="text-sm">
                <p className="font-medium text-muted-foreground mb-1">
                  Removed ({removed.length}):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {removed.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground line-through"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SEO Content */}
        <section className="space-y-16 mt-16">
          {/* How It Works */}
          <div>
            <h2 className="text-2xl font-bold mb-4">How the Random Name Picker Works</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { step: '1', title: 'Paste Names', desc: 'Type or paste your student list into the text area — one name per line or comma-separated. You can also import a CSV file.' },
                { step: '2', title: 'Pick a Name', desc: 'Click "Pick a Random Name" and watch the spinner land on a student. The selection uses the Fisher-Yates algorithm for fair, unbiased randomness.' },
                { step: '3', title: 'Use & Repeat', desc: 'Copy the result, remove the student from the pool so they won\'t be picked again, or reset and start fresh.' },
              ].map((s) => (
                <Card key={s.step} className="p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm mb-3">
                    {s.step}
                  </div>
                  <h3 className="font-semibold mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Classroom Use Cases</h2>
            <ul className="grid gap-3 sm:grid-cols-2 list-none">
              {[
                'Cold-calling students for class participation',
                'Choosing presenters or discussion leaders',
                'Assigning roles in group activities',
                'Selecting students for rewards or prizes',
                'Picking volunteers for demonstrations',
                'Running classroom games and icebreakers',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Benefits of Random Student Selection</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: 'Fair & Unbiased', desc: 'Every student has an equal chance of being selected, eliminating favoritism or unconscious bias.' },
                { title: 'Increases Engagement', desc: 'Students stay alert and prepared when they know anyone could be called on at any time.' },
                { title: 'Saves Time', desc: 'No more scanning the room or maintaining mental lists — pick a name in one click.' },
                { title: 'Completely Private', desc: 'No data leaves your browser. Student names are stored only in your local device.' },
              ].map((b) => (
                <Card key={b.title} className="p-5">
                  <h3 className="font-semibold mb-1">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="random">
                <AccordionTrigger>Is the name picker truly random?</AccordionTrigger>
                <AccordionContent>
                  Yes. We use the Fisher-Yates shuffle algorithm — the gold standard for unbiased
                  randomization in computer science. Every student has an exactly equal probability of being
                  selected.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="remove">
                <AccordionTrigger>Can I remove names after they are picked?</AccordionTrigger>
                <AccordionContent>
                  Absolutely. After a name is picked, click "Remove from Pool" to take that student out of
                  future selections. This is perfect for ensuring every student gets a turn.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="privacy">
                <AccordionTrigger>Is student data stored anywhere?</AccordionTrigger>
                <AccordionContent>
                  No. All data stays in your browser via localStorage. Nothing is sent to any server, and no
                  accounts are required. Your students' information remains completely private.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="groups">
                <AccordionTrigger>Can I use this for groups or games?</AccordionTrigger>
                <AccordionContent>
                  Yes! You can use this tool for picking volunteers, assigning roles, running games, or any
                  scenario requiring random selection. For splitting students into multiple groups at once,
                  try our{' '}
                  <Link to="/random-group-generator" className="text-primary underline">
                    Random Group Generator
                  </Link>
                  .
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Internal links */}
          <div>
            <h2 className="text-2xl font-bold mb-4">More Classroom Tools</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                to="/random-group-generator"
                className="rounded-2xl border bg-card p-5 hover:shadow-md transition-shadow flex flex-col"
              >
                <h3 className="font-semibold mb-1">Random Group Generator</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  Split your class into balanced, randomized groups with pair-avoidance and drag-and-drop
                  editing.
                </p>
                <span className="text-primary text-sm font-medium mt-3 inline-flex items-center">
                  Try it <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </Link>
              <Link
                to="/classroom-schedule-maker"
                className="rounded-2xl border bg-card p-5 hover:shadow-md transition-shadow flex flex-col"
              >
                <h3 className="font-semibold mb-1">Classroom Schedule Maker</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  Build a color-coded weekly class schedule. Export as PNG, share via link — no sign-up
                  needed.
                </p>
                <span className="text-primary text-sm font-medium mt-3 inline-flex items-center">
                  Try it <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ClassroomBuilder. Built for students, by students.</p>
        </div>
      </footer>
    </div>
  );
};

export default RandomNamePicker;
