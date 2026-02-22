import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shuffle, Copy, Download, Users, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
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
const PAIR_HISTORY_KEY = 'classgrid-pair-history';

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
  localStorage.setItem(PAIR_HISTORY_KEY, JSON.stringify(history.slice(-20))); // keep last 20
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
      const weight = history.length - h; // recent = higher weight
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
  const [groups, setGroups] = useState<string[][] | null>(null);

  // SEO meta tags
  useEffect(() => {
    document.title = 'Random Group Generator — ClassGrid | Free Student Group Maker';
    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('description', 'Free random group generator for teachers and students. Split class lists into groups instantly with drag-and-drop, pair history, and CSV export. No sign-up required.');
    setMeta('keywords', 'random group generator, student group maker, classroom groups, team generator, group randomizer, teacher tools');
    setMeta('og:title', 'Random Group Generator — ClassGrid', 'property');
    setMeta('og:description', 'Split student names into random groups instantly. Drag-and-drop, pair avoidance, CSV export — 100% free.', 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:url', 'https://classgrid.app/groups', 'property');
    setMeta('twitter:title', 'Random Group Generator — ClassGrid');
    setMeta('twitter:description', 'Split student names into random groups instantly. Drag-and-drop, pair avoidance, CSV export — 100% free.');

    return () => {
      document.title = 'ClassGrid — Free Student Schedule Maker';
    };
  }, []);

  const names = namesInput
    .split('\n')
    .map(n => n.trim())
    .filter(Boolean);

  const computeGroupCount = useCallback(() => {
    if (names.length === 0) return 0;
    if (mode === 'groups') return Math.min(count, names.length);
    return Math.max(1, Math.ceil(names.length / count));
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

    // Save pairs to history
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
      {/* Header */}
      <AppHeader />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <header className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <Users className="h-8 w-8 text-primary" aria-hidden="true" />
              <h1 className="text-3xl font-bold sm:text-4xl">Random Group Generator</h1>
            </div>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Paste student names, pick your group settings, and generate random groups instantly. Drag and drop to swap members.
            </p>
          </header>

          {/* Input Section */}
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
                    {mode === 'groups' ? 'Number of groups' : 'People per group'}
                  </Label>
                  <Input
                    id="count-input"
                    type="number"
                    min={1}
                    max={names.length || 100}
                    value={count}
                    onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))}
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
        </motion.div>
      </main>
    </div>
  );
};

export default GroupGenerator;
