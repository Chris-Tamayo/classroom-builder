import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Users, ArrowRight, Calendar, Shuffle, LayoutGrid } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AppHeader from '@/components/AppHeader';

const NoRepeatGroupGenerator = () => {
  useEffect(() => {
    document.title = 'Random Group Generator with No Repeat Pairs (Free Tool) | ClassroomBuilder';
    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('description', 'Generate random student groups with no repeat pairs. Free tool that tracks pairing history so the same two students never end up together twice. Built for teachers.');
    setMeta('keywords', 'random group generator no repeat, no repeat pairs group maker, avoid repeat pairs student groups, unique grouping tool for teachers');
    setMeta('og:title', 'Random Group Generator with No Repeat Pairs — ClassroomBuilder', 'property');
    setMeta('og:description', 'Stop pairing the same students together. Generate truly varied groups with automatic pair-avoidance tracking.', 'property');
    setMeta('og:type', 'article', 'property');
    setMeta('og:url', 'https://www.classroombuilder.com/blog/random-group-generator-no-repeat', 'property');
    setMeta('twitter:title', 'Random Group Generator with No Repeat Pairs — ClassroomBuilder');
    setMeta('twitter:description', 'Stop pairing the same students together. Generate truly varied groups with automatic pair-avoidance tracking.');

    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "How does the no-repeat pairs feature work?", "acceptedAnswer": { "@type": "Answer", "text": "The tool stores a history of which students have been paired together in previous rounds. When generating new groups, it runs multiple shuffles and selects the arrangement with the fewest repeated pairs." } },
        { "@type": "Question", "name": "How many rounds of history does it track?", "acceptedAnswer": { "@type": "Answer", "text": "The tool tracks up to 20 rounds of pairing history in your browser's local storage. You can clear the history at any time." } },
        { "@type": "Question", "name": "Will students ever repeat pairs?", "acceptedAnswer": { "@type": "Answer", "text": "With small classes, the tool can avoid repeats for many rounds. With larger classes, repeats become mathematically unavoidable eventually, but the tool always minimizes them." } },
        { "@type": "Question", "name": "Is the pair history saved between sessions?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. History is saved in your browser's local storage, so it persists even after you close the tab. Clear it anytime with the Reset History button." } },
        { "@type": "Question", "name": "Can I still drag students between groups after generating?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. After generating, drag and drop any student to a different group. The tool records the final arrangement, not the initial shuffle." } },
        { "@type": "Question", "name": "Does this work for pair work (groups of 2)?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — and pair work is where no-repeat tracking matters most. Set the group size to 2 and the tool will ensure different partners each round." } }
      ]
    });
    document.head.appendChild(ld);
    return () => {
      document.head.removeChild(ld);
      document.title = 'ClassroomBuilder — Free Tools for Students & Teachers';
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto px-4 py-10 max-w-3xl">

        {/* Header */}
        <header className="text-center mb-12">
          <p className="text-sm text-muted-foreground mb-2">Teaching Strategies</p>
          <h1 className="text-3xl font-bold sm:text-4xl mb-4">Random Group Generator with No Repeat Pairs</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stop pairing the same students together round after round. Here's how to generate truly varied groups — automatically.
          </p>
        </header>

        {/* Article body */}
        <article className="space-y-10 text-base leading-relaxed text-foreground/90">

          <section className="space-y-4">
            <p>
              You run a think-pair-share activity every Monday. By week four, students are groaning: <em>"I already worked with them three times."</em>
            </p>
            <p>
              It's not a laziness problem — it's a math problem. Pure randomness doesn't guarantee variety. With 25 students split into pairs, there's a surprisingly high chance that the same two students land together in back-to-back rounds. Over a full semester, certain pairs might repeat five or six times while others never meet.
            </p>
            <p>
              A <strong>random group generator with no repeat pairs</strong> solves this by tracking who has already worked together and actively avoiding those combinations in future rounds. The result: every student collaborates with the widest possible range of classmates.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Why No-Repeat Pairs Matter in the Classroom</h2>
            <p>
              Repeated pairings aren't just annoying — they undermine the purpose of group work. Here's what's at stake:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong>Social equity.</strong> When the same students keep getting paired, quieter or less popular students miss out on building connections with a wider peer group.</li>
              <li><strong>Academic diversity.</strong> Different partners bring different perspectives. A student who always works with the same high-achiever never gets to practice leadership or explaining concepts themselves.</li>
              <li><strong>Student buy-in.</strong> Students notice repeated pairings. It erodes trust in the "randomness" of your system — and once they think it's rigged, engagement drops.</li>
              <li><strong>Behavior management.</strong> Certain pairs create disruptions. Without pair tracking, you're relying on luck (or constant manual intervention) to keep them apart.</li>
            </ul>
            <p>
              Pair-avoidance isn't a nice-to-have. For teachers who use group work regularly, it's the difference between a system that works and one that slowly breaks down.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Best Strategies for Avoiding Repeat Pairs</h2>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">1. Use a Tool That Tracks History Automatically</h3>
              <p>
                Manual tracking is a dead end. Even with a spreadsheet, managing pair combinations for 28 students across 15 rounds means tracking over 5,000 potential pairs. A <Link to="/random-group-generator" className="text-primary underline underline-offset-2 hover:text-primary/80">digital group generator</Link> with built-in pair history handles this instantly.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">2. Reset History at Natural Breakpoints</h3>
              <p>
                Don't let pair history accumulate forever. Clear it at the start of each semester, unit, or term. This prevents the algorithm from running out of fresh combinations and keeps groupings feeling new.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">3. Smaller Groups = More Pair Combinations</h3>
              <p>
                Groups of 2 exhaust unique pairs fastest. With 20 students, there are 190 unique pairs — but only 10 pairs per round. After 19 rounds, every possible pair has occurred. Groups of 3 or 4 generate more internal pairs per round but also create more total combinations to work through.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">4. Allow Post-Shuffle Adjustments</h3>
              <p>
                No algorithm can account for everything. Maybe two students had a conflict yesterday, or a new student joined. The best workflow: generate with pair avoidance, then <strong>drag and drop</strong> to make one or two targeted swaps. The tool records your final arrangement, not the initial shuffle.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Common Mistakes When Avoiding Repeat Pairs</h2>
            <ul className="list-disc list-inside space-y-3 pl-2">
              <li>
                <strong>Trying to do it manually.</strong> Teachers who attempt to track pairs on paper or in a spreadsheet inevitably give up after a few weeks. The cognitive load is too high — and one mistake cascades through future rounds.
              </li>
              <li>
                <strong>Assuming "random" means "varied."</strong> A coin can land heads five times in a row. True randomness guarantees nothing about variety. You need <em>constrained</em> randomness — random within the rule that recent pairs are deprioritized.
              </li>
              <li>
                <strong>Never clearing history.</strong> If pair history grows indefinitely, the algorithm eventually has no good options left and is forced into repeat pairs anyway. Regular resets keep things working smoothly.
              </li>
              <li>
                <strong>Ignoring absent students.</strong> If a student is absent, their name shouldn't be in the generator that day. Including absent students creates phantom pairs in the history that skew future results.
              </li>
              <li>
                <strong>Using tools that don't save between sessions.</strong> If your tool forgets pair history when you close the browser, you lose all the tracking benefit. Make sure history persists.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">How to Use ClassroomBuilder's No-Repeat Group Generator</h2>
            <p>
              ClassroomBuilder's <Link to="/random-group-generator" className="text-primary underline underline-offset-2 hover:text-primary/80">free random group generator</Link> has pair-avoidance built in. Here's how it works:
            </p>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li><strong>Paste your class list</strong> — one student name per line. Remove any absent students for that day.</li>
              <li><strong>Set your group size</strong> — choose a fixed number of groups, or set a minimum students-per-group and let the tool calculate.</li>
              <li><strong>Enable "Avoid Previous Pairs"</strong> — the tool checks this by default. It runs 30 randomization attempts behind the scenes and picks the arrangement with the fewest historical repeats.</li>
              <li><strong>Generate</strong> — groups appear instantly. Each group is displayed as a card you can drag students between.</li>
              <li><strong>Fine-tune if needed</strong> — drag and drop to swap students between groups. The tool records your final arrangement.</li>
              <li><strong>Export</strong> — copy to clipboard or download as CSV. Project on screen, paste into Google Docs, or print.</li>
            </ol>
            <p>
              Pair history is saved in your browser's local storage — up to 20 rounds. Hit <strong>Clear History</strong> at the start of a new semester to reset.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Practical Examples</h2>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Weekly Think-Pair-Share (Pairs)</h3>
              <p>
                A 7th-grade ELA teacher runs think-pair-share every Monday with 24 students. With pure random pairing, by week 6 several students have been partners three times while others haven't met. With no-repeat tracking, every student works with a <strong>different partner each week for 23 consecutive weeks</strong> before any pair repeats.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Lab Partners (Groups of 3)</h3>
              <p>
                A chemistry teacher assigns lab groups of 3 from a class of 30. Each round creates 10 groups with 30 internal pairs. Without pair tracking, repeat partners start appearing by round 3. With no-repeat tracking, fresh combinations last 6–8 rounds before any repetition — covering most of a semester's labs.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Discussion Groups (Groups of 4)</h3>
              <p>
                A high school history teacher uses Socratic discussion groups of 4 with 28 students. Each round generates 42 internal pairs across 7 groups. The no-repeat system ensures that over 8 discussion rounds, students work with <strong>24+ different classmates</strong> — nearly the entire class.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Peer Review Partners (Pairs, Rotating)</h3>
              <p>
                An English teacher assigns peer review partners for weekly writing workshops. With 22 students and pair avoidance, every student reviews a <strong>different classmate's work each week for 21 weeks straight</strong>. No spreadsheet required.
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="faq-1">
                <AccordionTrigger className="text-foreground text-left">How does the no-repeat pairs feature actually work?</AccordionTrigger>
                <AccordionContent>
                  The tool stores a record of which students have been grouped together in previous rounds. When you generate new groups, it runs 30 different random shuffles behind the scenes and scores each one based on how many pairs appeared in past rounds. It picks the arrangement with the <strong>lowest repeat score</strong> — giving you the freshest possible combinations.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger className="text-foreground text-left">How many rounds of history does it remember?</AccordionTrigger>
                <AccordionContent>
                  Up to 20 rounds. History is stored in your browser's local storage, so it persists across sessions — even if you close the tab. You can clear it anytime with the <strong>Clear History</strong> button.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-3">
                <AccordionTrigger className="text-foreground text-left">Will students ever be paired with the same person twice?</AccordionTrigger>
                <AccordionContent>
                  Eventually, yes — it's mathematically unavoidable. With a class of 20 split into pairs, there are 190 unique pairs. After 19 rounds, every possible pair has been used. The tool <strong>delays repeats as long as possible</strong> and always picks the least-repeated arrangement.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-4">
                <AccordionTrigger className="text-foreground text-left">Does this work for groups larger than 2?</AccordionTrigger>
                <AccordionContent>
                  Yes. The tool tracks all internal pairs within each group, not just partner pairs. A group of 4 generates 6 internal pairs — all tracked for avoidance in future rounds. Larger groups actually create more fresh combinations per round.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-5">
                <AccordionTrigger className="text-foreground text-left">What happens if a student is absent?</AccordionTrigger>
                <AccordionContent>
                  Remove absent students from your name list before generating. This prevents phantom pairs from entering the history. The tool works with whatever names you provide — no fixed roster required.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-6" className="border-none">
                <AccordionTrigger className="text-foreground text-left">Is my student data private?</AccordionTrigger>
                <AccordionContent>
                  Completely. Everything runs in your browser. No data is sent to any server. Your student names and pair history never leave your device.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* CTA */}
          <section className="space-y-4 text-center">
            <h2 className="text-2xl font-semibold text-foreground">Try It Now — Free, No Sign-Up</h2>
            <p>
              Paste your class list, hit generate, and see how pair avoidance keeps every round fresh. It takes 10 seconds.
            </p>
            <Link
              to="/random-group-generator"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Shuffle className="h-4 w-4" /> Open the Group Generator <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

        </article>

        {/* Internal links */}
        <div className="pt-8 mt-12">
          <h2 className="text-xl font-semibold mb-4">More Free Teacher Tools</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link to="/random-group-generator" className="group block rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Random Group Generator
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Split your class into fair, randomized groups with pair avoidance and CSV export.
              </p>
            </Link>
            <Link to="/random-name-picker" className="group block rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Shuffle className="h-4 w-4 text-primary" /> Random Name Picker
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Pick a random student name with a fun spin animation. Great for cold calling.
              </p>
            </Link>
            <Link to="/seating-chart-generator" className="group block rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-primary" /> Seating Chart Generator
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Create drag-and-drop classroom seating charts with lock, randomize, and PNG export.
              </p>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ClassroomBuilder. Built for students, by students.</p>
        </div>
      </footer>
    </div>
  );
};

export default NoRepeatGroupGenerator;
