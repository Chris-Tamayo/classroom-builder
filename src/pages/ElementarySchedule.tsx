import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Calendar, ArrowRight, Users, Shuffle, LayoutGrid } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AppHeader from '@/components/AppHeader';
import { ScheduleMakerTool } from '@/components/schedule/ScheduleMakerTool';

const ElementarySchedule = () => {
  useEffect(() => {
    document.title = 'Classroom Schedule Maker for Elementary Teachers (Free Tool) | ClassroomBuilder';
    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('description', 'Create a classroom schedule in seconds. Free elementary schedule maker with drag-and-drop editing, printable layouts, and no login required.');
    setMeta('keywords', 'classroom schedule maker elementary, elementary class schedule template, daily classroom schedule for teachers, school schedule generator');
    setMeta('og:title', 'Classroom Schedule Maker for Elementary Teachers — ClassroomBuilder', 'property');
    setMeta('og:description', 'Free elementary classroom schedule maker. Drag-and-drop, printable, no login. Built for real classrooms.', 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:url', 'https://www.classroombuilder.com/classroom-schedule-maker-elementary', 'property');
    setMeta('twitter:title', 'Classroom Schedule Maker for Elementary Teachers — ClassroomBuilder');
    setMeta('twitter:description', 'Free elementary classroom schedule maker. Drag-and-drop, printable, no login.');

    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Can I print my classroom schedule?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Export your schedule as a high-resolution PNG to print as a poster, glue into a planner, or display on your classroom screen." } },
        { "@type": "Question", "name": "Can I edit my schedule later?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Click any class block to edit the time, subject, room, or color. You can also click empty grid slots to add a new block instantly." } },
        { "@type": "Question", "name": "Does this work for different grade levels?", "acceptedAnswer": { "@type": "Answer", "text": "It is optimized for elementary classrooms (K–5) but works for any grade — middle school, high school, homeschool, or specials teachers who rotate rooms." } },
        { "@type": "Question", "name": "Is this tool really free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — completely free. No login, no email, no payment, no watermark on exports." } },
        { "@type": "Question", "name": "Can I share my schedule with a sub or co-teacher?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Use the Share button to copy a link that loads your exact schedule on any device — perfect for sub plans." } }
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

      <main className="container mx-auto px-4 py-6 max-w-6xl">

        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Calendar className="h-8 w-8 text-primary" aria-hidden="true" />
            <h1 className="text-3xl font-bold sm:text-4xl">Classroom Schedule Maker for Elementary Teachers</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-sm">
            Create a clear, structured classroom schedule in minutes. This free tool helps elementary teachers plan their day, organize subjects, and keep students on track — without messy spreadsheets or templates. Drag-and-drop editing, color-coded blocks, printable PNG export. No login required.
          </p>
        </header>

        {/* 🔥 TOOL — embedded directly, high on page */}
        <ScheduleMakerTool showInlineActions />

        {/* Supporting content */}
        <section className="mt-16 space-y-10 text-sm text-muted-foreground leading-relaxed max-w-4xl mx-auto" aria-label="About the elementary classroom schedule maker">

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">Why Elementary Teachers Need a Structured Schedule</h2>
            <p className="mb-2">
              In elementary classrooms, structure is everything. A clear daily schedule helps students feel secure, reduces behavior issues, and makes transitions smoother throughout the day.
            </p>
            <p className="mb-2">
              But building that schedule from scratch every time is frustrating. Most tools are either too complex, require logins, or don't match how real classrooms operate — with morning meetings, specials rotations, recess windows, and pull-out groups.
            </p>
            <p>
              This classroom schedule maker is designed specifically for elementary teachers — simple, fast, and flexible enough to adjust as your class changes.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">How to Use the Schedule Maker</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Click <strong>Add Class</strong> (or click any empty grid slot) and enter your subject — Math, Reading, Recess, Specials, etc.</li>
              <li>Set the time block and select which days of the week it repeats.</li>
              <li>Pick a color so students can recognize each subject at a glance.</li>
              <li>Drag-edit by clicking blocks to fine-tune times or change rooms.</li>
              <li>Click <strong>Export</strong> to download a printable PNG — or <strong>Share</strong> to send a link to a sub or co-teacher.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">Common Elementary Schedule Examples</h2>

            <h3 className="text-base font-semibold text-foreground mt-4 mb-1">Daily Classroom Schedule</h3>
            <p className="mb-3">
              Plan your full day from morning arrival to dismissal. A typical K–2 day might look like: morning meeting, phonics, math, recess, lunch, read-aloud, science/social studies, specials, and pack-up.
            </p>

            <h3 className="text-base font-semibold text-foreground mt-4 mb-1">Block Schedule</h3>
            <p className="mb-3">
              Group subjects into longer learning blocks — like a 90-minute literacy block or a 60-minute math workshop — to reduce transitions and improve focus. Color-code each block so students can read the schedule from across the room.
            </p>

            <h3 className="text-base font-semibold text-foreground mt-4 mb-1">Flexible Schedule</h3>
            <p>
              Adjust your day easily for assemblies, testing days, picture day, or special events without starting over. Drag a block to a new time, shorten it, or remove it for the day — your base schedule stays intact.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">Why Teachers Use This Schedule Maker</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>No login required</strong> — start instantly</li>
              <li><strong>Built for real classrooms</strong> — not generic calendar templates</li>
              <li><strong>Drag-and-drop editing</strong> for fast adjustments</li>
              <li><strong>Works on any device</strong> — laptop, tablet, smartboard</li>
              <li><strong>Printable PNG export</strong> in one click</li>
              <li><strong>Color-coded blocks</strong> students can read from across the room</li>
              <li><strong>Completely free</strong> — no ads, no watermark, no upsell</li>
            </ul>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full -mt-2">
              <AccordionItem value="q1">
                <AccordionTrigger className="text-foreground text-left">Can I print my classroom schedule?</AccordionTrigger>
                <AccordionContent>
                  Yes. Export your schedule as a high-resolution PNG to print as a poster, glue into a planner, or display on your classroom screen.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger className="text-foreground text-left">Can I edit my schedule later?</AccordionTrigger>
                <AccordionContent>
                  Yes. Click any class block to edit the time, subject, room, or color. You can also click empty grid slots to add a new block instantly.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger className="text-foreground text-left">Does this work for different grade levels?</AccordionTrigger>
                <AccordionContent>
                  It's optimized for elementary classrooms (K–5) but works for any grade — middle school, high school, homeschool, or specials teachers who rotate rooms.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger className="text-foreground text-left">Is this tool really free?</AccordionTrigger>
                <AccordionContent>
                  Yes — completely free. No login, no email, no payment, no watermark on exports.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q5" className="border-b-0">
                <AccordionTrigger className="text-foreground text-left">Can I share my schedule with a sub or co-teacher?</AccordionTrigger>
                <AccordionContent>
                  Yes. Use the Share button to copy a link that loads your exact schedule on any device — perfect for sub plans.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Internal links */}
          <div className="pt-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">More Free Classroom Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

        </section>
      </main>

      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ClassroomBuilder. Built for students, by students.</p>
        </div>
      </footer>
    </div>
  );
};

export default ElementarySchedule;
