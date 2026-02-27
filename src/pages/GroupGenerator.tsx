import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shuffle, Copy, Download, Users, RotateCcw, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
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

// ── Pair history helpers ──────────────────────────
const PAIR_HISTORY_KEY = 'classroombuilder-pair-history';
type PairSet = string[][];

function loadPairHistory(): PairSet[] {
  try {
    const raw = localStorage.getItem(PAIR_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePairHistory(history: PairSet[]) {
  localStorage.setItem(PAIR_HISTORY_KEY, JSON.stringify(history.slice(-20)));
}

function extractPairs(groups: string[][]): PairSet {
  const pairs: string[][] = [];
  for (const g of groups) {
    for (let i = 0; i < g.length; i++) {
      for (let j = i + 1; j < g.length; j++) {
        pairs.push([g[i], g[j]].sort());
      }
    }
  }
  return pairs;
}

function pairScore(groups: string[][], history: PairSet[]): number {
  const current = extractPairs(groups);
  let score = 0;
  for (const [a, b] of current) {
    for (let h = 0; h < history.length; h++) {
      const weight = history.length - h;
      if (history[h].some(([x, y]) => x === a && y === b)) {
        score += weight;
      }
    }
  }
  return score;
}

function generateGroups(names: string[], groupCount: number): string[][] {
  const shuffled = fisherYatesShuffle(names);
  const groups: string[][] = Array.from({ length: groupCount }, () => []);
  shuffled.forEach((name, i) => {
    groups[i % groupCount].push(name);
  });
  return groups;
}

function generateWithPairAvoidance(names: string[], groupCount: number, attempts = 30): string[][] {
  const history = loadPairHistory();
  if (history.length === 0) return generateGroups(names, groupCount);
  let best = generateGroups(names, groupCount);
  let bestScore = pairScore(best, history);
  for (let i = 1; i < attempts; i++) {
    const candidate = generateGroups(names, groupCount);
    const s = pairScore(candidate, history);
    if (s < bestScore) {
      best = candidate;
      bestScore = s;
      if (s === 0) break;
    }
  }
  return best;
}

// ── Component ─────────────────────────────────────
const GroupGenerator = () => {
  const [namesInput, setNamesInput] = useState('');
  const [mode, setMode] = useState<'groups' | 'perGroup'>('groups');
  const [count, setCount] = useState(2);
  const [countInput, setCountInput] = useState('2');
  const [groups, setGroups] = useState<string[][] | null>(null);

  // SEO meta tags
  useEffect(() => {
    document.title = 'Random Group Generator for Teachers — Free Student Group Maker | ClassroomBuilder';
    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('description', 'Free random group generator for teachers. Instantly split your class list into fair, randomized groups with smart pair avoidance, drag-and-drop editing, and CSV export. No sign-up required.');
    setMeta('keywords', 'random group generator for teachers, student group maker, classroom group generator, team generator for teachers, random group creator, group randomizer');
    setMeta('og:title', 'Random Group Generator for Teachers — ClassroomBuilder', 'property');
    setMeta('og:description', 'Split student names into random groups instantly. Smart pair avoidance, drag-and-drop, CSV export — 100% free for teachers.', 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:url', 'https://classroombuilder.com/random-group-generator', 'property');
    setMeta('twitter:title', 'Random Group Generator for Teachers — ClassroomBuilder');
    setMeta('twitter:description', 'Split student names into random groups instantly. Smart pair avoidance, drag-and-drop, CSV export — 100% free for teachers.');

    return () => {
      document.title = 'ClassroomBuilder — Free Tools for Teachers & Students';
    };
  }, []);

  const names = namesInput
    .split('\n')
    .map(n => n.trim())
    .filter(Boolean);

  const computeGroupCount = useCallback(() => {
    if (names.length === 0) return 0;
    if (mode === 'groups') return Math.min(count, names.length);
    return Math.max(1, Math.floor(names.length / count));
  }, [names.length, mode, count]);

  const handleGenerate = () => {
    if (names.length < 2) {
      toast.error('Enter at least 2 names');
      return;
    }
    const gc = computeGroupCount();
    if (gc < 1) return;
    const result = generateWithPairAvoidance(names, gc);
    setGroups(result);
    const history = loadPairHistory();
    history.push(extractPairs(result));
    savePairHistory(history);
  };

  const handleCopy = () => {
    if (!groups) return;
    const text = groups
      .map((g, i) => `Group ${i + 1}:\n${g.join('\n')}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    toast.success('Results copied to clipboard');
  };

  const handleCSV = () => {
    if (!groups) return;
    const maxLen = Math.max(...groups.map(g => g.length));
    const header = groups.map((_, i) => `Group ${i + 1}`).join(',');
    const rows = Array.from({ length: maxLen }, (_, r) =>
      groups.map(g => g[r] || '').join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'groups.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded');
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !groups) return;
    const srcGroup = parseInt(result.source.droppableId);
    const dstGroup = parseInt(result.destination.droppableId);
    const srcIdx = result.source.index;
    const dstIdx = result.destination.index;
    const newGroups = groups.map(g => [...g]);
    const [moved] = newGroups[srcGroup].splice(srcIdx, 1);
    newGroups[dstGroup].splice(dstIdx, 0, moved);
    setGroups(newGroups);
  };

  const handleClearHistory = () => {
    localStorage.removeItem(PAIR_HISTORY_KEY);
    toast.success('Pair history cleared');
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* ─── Above the Tool: H1 + Intro ─── */}
          <header className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <Users className="h-8 w-8 text-primary" aria-hidden="true" />
              <h1 className="text-3xl font-bold sm:text-4xl">Random Group Generator for Teachers</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Need to split your class into fair, randomized groups? This free random group generator for teachers lets you paste a student list, choose your group size, and instantly create balanced teams. It remembers past groupings so the same students aren't paired together every time — saving you time and keeping collaboration fresh. No sign-up, no ads, and your data never leaves your browser.
            </p>
          </header>

          {/* ─── Tool Section ─── */}
          <section aria-label="Group configuration" className="grid md:grid-cols-[1fr_280px] gap-6 mb-8">
            <div className="space-y-2">
              <Label htmlFor="names-input" className="text-sm font-medium">Student Names (one per line)</Label>
              <Textarea
                id="names-input"
                value={namesInput}
                onChange={e => setNamesInput(e.target.value)}
                placeholder={"Alice Johnson\nBob Smith\nCharlie Davis\nDana Lee\n..."}
                className="min-h-[220px] font-mono text-sm"
                aria-label="Paste student names, one per line"
              />
              <p className="text-xs text-muted-foreground">{names.length} name{names.length !== 1 ? 's' : ''} detected</p>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Group Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={mode} onValueChange={(v) => setMode(v as 'groups' | 'perGroup')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="groups" id="mode-groups" />
                    <Label htmlFor="mode-groups" className="cursor-pointer">Number of groups</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="perGroup" id="mode-per" />
                    <Label htmlFor="mode-per" className="cursor-pointer">People per group</Label>
                  </div>
                </RadioGroup>

                <div className="space-y-1">
                  <Label htmlFor="count-input" className="text-xs text-muted-foreground">
                    {mode === 'groups' ? 'Number of groups' : 'Least people per group'}
                  </Label>
                  <Input
                    id="count-input"
                    type="number"
                    min={1}
                    max={names.length || 100}
                    value={countInput}
                    onChange={e => setCountInput(e.target.value)}
                    onBlur={() => {
                      const parsed = parseInt(countInput);
                      if (!parsed || parsed < 1 || isNaN(parsed)) {
                        setCountInput(String(count));
                      } else {
                        setCount(parsed);
                        setCountInput(String(parsed));
                      }
                    }}
                  />
                </div>

                <Button onClick={handleGenerate} className="w-full rounded-full shadow-md shadow-primary/20" disabled={names.length < 2}>
                  <Shuffle className="h-4 w-4 mr-1" /> Generate Groups
                </Button>

                <Button variant="ghost" size="sm" onClick={handleClearHistory} className="w-full text-xs text-muted-foreground">
                  <RotateCcw className="h-3 w-3 mr-1" /> Clear pair history
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Results */}
          <AnimatePresence mode="wait">
            {groups && groups.length > 0 && (
              <motion.div
                key={JSON.stringify(groups)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Results</h2>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleGenerate}>
                      <Shuffle className="h-4 w-4 mr-1" /> Regenerate
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      <Copy className="h-4 w-4 mr-1" /> Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCSV}>
                      <Download className="h-4 w-4 mr-1" /> CSV
                    </Button>
                  </div>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {groups.map((group, gi) => (
                      <Droppable droppableId={String(gi)} key={gi}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`transition-colors ${snapshot.isDraggingOver ? 'border-primary/50 bg-primary/5' : ''}`}
                          >
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                                <span>Group {gi + 1}</span>
                                <span className="text-xs font-normal text-muted-foreground">{group.length} member{group.length !== 1 ? 's' : ''}</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pb-3">
                              <ul className="space-y-1">
                                {group.map((name, ni) => (
                                  <Draggable draggableId={`${gi}-${ni}-${name}`} index={ni} key={`${gi}-${ni}-${name}`}>
                                    {(prov, snap) => (
                                      <li
                                        ref={prov.innerRef}
                                        {...prov.draggableProps}
                                        {...prov.dragHandleProps}
                                        className={`rounded-md px-3 py-1.5 text-sm cursor-grab active:cursor-grabbing select-none transition-colors ${
                                          snap.isDragging
                                            ? 'bg-primary/10 shadow-md'
                                            : 'bg-muted/60 hover:bg-muted'
                                        }`}
                                      >
                                        {name}
                                      </li>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </ul>
                            </CardContent>
                          </Card>
                        )}
                      </Droppable>
                    ))}
                  </div>
                </DragDropContext>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Below the Tool: SEO Content ─── */}
          <section className="mt-16 space-y-10 text-sm text-muted-foreground leading-relaxed" aria-label="About the random group generator for teachers">

            {/* How It Works */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">How Does This Random Group Generator Work?</h2>
              <p className="mb-2">
                Using the random group generator for teachers is simple: paste your class roster (one name per line), choose whether you want a fixed number of groups or a minimum number of students per group, and hit <strong>Generate Groups</strong>.
              </p>
              <p className="mb-2">
                Under the hood, the tool uses a <a href="https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80">Fisher-Yates shuffle</a> — a mathematically proven algorithm that ensures every possible arrangement is equally likely. Students are then distributed evenly across groups so no team is significantly larger than another.
              </p>
              <p>
                The tool also includes <strong>smart pair avoidance</strong>: it remembers your last 20 groupings and actively tries to avoid putting the same students together repeatedly. This ensures varied collaboration across the semester.
              </p>
            </div>

            {/* Use Cases */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Use Cases in the Classroom</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Group projects:</strong> Quickly assign fair teams for research presentations, science labs, or group essays.</li>
                <li><strong>Discussion groups:</strong> Rotate literature circles, Socratic seminars, or peer review partners so students hear diverse perspectives.</li>
                <li><strong>Lab partners:</strong> Pair students for chemistry, biology, or computer science labs without repeating the same partners.</li>
                <li><strong>Jigsaw activities:</strong> Split students into expert groups and then reassemble them into mixed teaching groups.</li>
                <li><strong>Team-building activities:</strong> Create random teams for classroom games, competitions, or icebreakers.</li>
                <li><strong>Substitute teacher prep:</strong> Leave a class roster and let the sub generate groups instantly — no planning needed.</li>
              </ul>
            </div>

            {/* Benefits */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Benefits of Using ClassroomBuilder's Group Generator</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Truly random & fair:</strong> Fisher-Yates ensures no bias — every arrangement has equal probability.</li>
                <li><strong>Smart pair avoidance:</strong> Automatically avoids repeating the same student pairs from recent sessions.</li>
                <li><strong>Drag-and-drop editing:</strong> Manually move students between groups after generating to accommodate special needs.</li>
                <li><strong>Export options:</strong> Copy results to clipboard or download as a CSV file for Google Sheets, Excel, or your LMS.</li>
                <li><strong>100% private:</strong> All processing happens in your browser — student names are never uploaded to a server.</li>
                <li><strong>No account required:</strong> Free to use instantly, no sign-up or login needed.</li>
              </ul>
            </div>

            {/* FAQs */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="faq-1">
                  <AccordionTrigger className="text-foreground text-left">Is this random group generator really free?</AccordionTrigger>
                  <AccordionContent>
                    Yes, completely free with no hidden fees, no sign-up, and no ads. ClassroomBuilder is built for teachers who need fast, reliable tools without the hassle.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2">
                  <AccordionTrigger className="text-foreground text-left">Is my student data safe?</AccordionTrigger>
                  <AccordionContent>
                    Absolutely. All names are processed entirely in your browser using JavaScript. Nothing is sent to a server — your student data stays on your device and is never stored or shared.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3">
                  <AccordionTrigger className="text-foreground text-left">How does pair avoidance work?</AccordionTrigger>
                  <AccordionContent>
                    Each time you generate groups, the tool saves which students were paired together in your browser's local storage (up to the last 20 sessions). On subsequent generations, it runs multiple shuffle attempts and picks the arrangement with the fewest repeated pairs. You can clear the history at any time.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-4">
                  <AccordionTrigger className="text-foreground text-left">Can I edit groups after generating?</AccordionTrigger>
                  <AccordionContent>
                    Yes! After generating, you can drag and drop any student between groups. This is useful for accommodating special needs, separating certain students, or balancing skill levels.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-5">
                  <AccordionTrigger className="text-foreground text-left">How many students can I add?</AccordionTrigger>
                  <AccordionContent>
                    There is no hard limit. The tool works well with typical class sizes (10–40 students) and can handle much larger lists. Performance remains fast since everything runs locally.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-6">
                  <AccordionTrigger className="text-foreground text-left">Can I use this for teams, not just classrooms?</AccordionTrigger>
                  <AccordionContent>
                    Of course! While designed for teachers, this random group generator works great for team-building events, workshop breakout groups, sports teams, or any situation where you need to split people into random groups.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-7">
                  <AccordionTrigger className="text-foreground text-left">What's the difference between "Number of groups" and "People per group"?</AccordionTrigger>
                  <AccordionContent>
                    "Number of groups" lets you set exactly how many groups you want (e.g., 4 groups). "People per group" lets you set the minimum group size (e.g., at least 3 per group), and the tool calculates how many groups that creates.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Internal Links */}
            <div className="border-t border-border pt-8">
              <h2 className="text-xl font-semibold text-foreground mb-3">More Free Teacher Tools</h2>
              <p className="mb-4">
                ClassroomBuilder offers a growing set of free tools designed for teachers and students. Check out our other tools:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link to="/builder" className="group block rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    Schedule Builder
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Build a color-coded weekly class schedule. Export as PNG or share via link — free, no sign-up required.
                  </p>
                </Link>
              </div>
            </div>

          </section>
        </motion.div>
      </main>
    </div>
  );
};

export default GroupGenerator;
