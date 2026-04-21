import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Calendar, ArrowRight, Users, Shuffle, LayoutGrid } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AppHeader from '@/components/AppHeader';

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
    setMeta('og:type', 'article', 'property');
    setMeta('og:url', 'https://www.classroombuilder.com/blog/classroom-schedule-maker-elementary', 'property');
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

      <main className="container mx-auto px-4 py-10 max-w-3xl">

        {/* Header */}
        <header className="text-center mb-10">
          <p className="text-sm text-muted-foreground mb-2 flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" /> For Elementary Teachers
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl mb-4">Classroom Schedule Maker for Elementary Teachers</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create a clear, structured classroom schedule in minutes. This free tool helps elementary teachers plan their day, organize subjects, and keep students on track — without messy spreadsheets or templates.
          </p>
        </header>

        {/* CTA to Tool — high on page */}
        <section className="my-8 rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Build Your Schedule Now</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Open the schedule maker, drop in your subjects, and export when you're done. Takes under 2 minutes.
          </p>
          <Link
            to="/classroom-schedule-maker"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Calendar className="h-4 w-4" /> Open the Schedule Maker <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Article body */}
        <article className="space-y-10 text-base leading-relaxed text-foreground/90">

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Why Elementary Teachers Need a Structured Schedule</h2>
            <p>
              In elementary classrooms, structure is everything. A clear daily schedule helps students feel secure, reduces behavior issues, and makes transitions smoother throughout the day.
            </p>
            <p>
              But building that schedule from scratch every time is frustrating. Most tools are either too complex, require logins, or don't match how real classrooms operate — with morning meetings, specials rotations, recess windows, and pull-out groups.
            </p>
            <p>
              This classroom schedule maker is designed specifically for elementary teachers — simple, fast, and flexible enough to adjust as your class changes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">How to Use the Classroom Schedule Maker</h2>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>Add your subjects or activities (Math, Reading, Recess, Specials, etc.)</li>
              <li>Set time blocks for each part of your day</li>
              <li>Drag and reorder to match your flow</li>
              <li>Adjust as needed for different days of the week</li>
              <li>Print or display your schedule for students</li>
            </ol>
            <p>
              Click any empty slot in the grid to instantly add a block — the time auto-fills based on where you clicked, just like Google Calendar.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Common Elementary Schedule Examples</h2>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Daily Classroom Schedule</h3>
              <p>
                Plan your full day from morning arrival to dismissal, including core subjects, transitions, and breaks. A typical K–2 day might look like: morning meeting, phonics, math, recess, lunch, read-aloud, science/social studies, specials, and pack-up.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Block Schedule</h3>
              <p>
                Group subjects into longer learning blocks — like a 90-minute literacy block or a 60-minute math workshop — to reduce transitions and improve focus. Color-code each block so students can read the schedule at a glance.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Flexible Schedule</h3>
              <p>
                Adjust your day easily for assemblies, testing days, picture day, or special events without starting over. Drag a block to a new time, shorten it, or remove it for the day — your base schedule stays intact.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Why Teachers Use This Schedule Maker</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong>No login required</strong> — start instantly</li>
              <li><strong>Built for real classrooms</strong> — not generic calendar templates</li>
              <li><strong>Drag-and-drop editing</strong> for fast adjustments</li>
              <li><strong>Works on any device</strong> — laptop, tablet, smartboard</li>
              <li><strong>Printable PNG export</strong> in one click</li>
              <li><strong>Color-coded blocks</strong> students can read from across the room</li>
              <li><strong>Completely free</strong> — no ads, no watermark, no upsell</li>
            </ul>
          </section>

          {/* FAQ */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="q1">
                <AccordionTrigger>Can I print my classroom schedule?</AccordionTrigger>
                <AccordionContent>
                  Yes. Export your schedule as a high-resolution PNG to print as a poster, glue into a planner, or display on your classroom screen.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>Can I edit my schedule later?</AccordionTrigger>
                <AccordionContent>
                  Yes. Click any class block to edit the time, subject, room, or color. You can also click empty grid slots to add a new block instantly.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger>Does this work for different grade levels?</AccordionTrigger>
                <AccordionContent>
                  It's optimized for elementary classrooms (K–5) but works for any grade — middle school, high school, homeschool, or specials teachers who rotate rooms.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger>Is this tool really free?</AccordionTrigger>
                <AccordionContent>
                  Yes — completely free. No login, no email, no payment, no watermark on exports.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q5">
                <AccordionTrigger>Can I share my schedule with a sub or co-teacher?</AccordionTrigger>
                <AccordionContent>
                  Yes. Use the Share button to copy a link that loads your exact schedule on any device — perfect for sub plans.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* CTA */}
          <section className="space-y-4 text-center">
            <h2 className="text-2xl font-semibold text-foreground">Ready to Build Your Schedule?</h2>
            <p>
              Skip the spreadsheet. Open the schedule maker, drop in your subjects, and have a printable plan in under 2 minutes.
            </p>
            <Link
              to="/classroom-schedule-maker"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Calendar className="h-4 w-4" /> Open the Schedule Maker <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

        </article>

        {/* Internal links */}
        <div className="pt-8 mt-12">
          <h2 className="text-xl font-semibold mb-4">More Free Classroom Tools</h2>
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

export default ElementarySchedule;
