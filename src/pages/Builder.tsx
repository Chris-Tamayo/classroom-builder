import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { ClassEntry } from '@/types/schedule';
import { useSchedule } from '@/hooks/useSchedule';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AppHeader from '@/components/AppHeader';
import { ScheduleMakerTool } from '@/components/schedule/ScheduleMakerTool';

const Builder = () => {
  const { classes, addClass } = useSchedule();

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
    setMeta('og:url', 'https://www.classroombuilder.com/classroom-schedule-maker', 'property');
    setMeta('twitter:title', 'Free Class Schedule Maker — ClassroomBuilder');
    setMeta('twitter:description', 'Build a color-coded weekly class schedule in seconds. Export, share, and print — 100% free.');

    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Is this schedule maker free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, completely free. No sign-up, no ads, no limits. Build as many schedules as you want." } },
        { "@type": "Question", "name": "Will my schedule be saved?", "acceptedAnswer": { "@type": "Answer", "text": "Your schedule is saved in your browser's local storage, so it persists between visits on the same device. You can also export a shareable link to access it anywhere." } },
        { "@type": "Question", "name": "Can I share my schedule with someone?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! Click the Share button to copy a link that contains your entire schedule. Anyone who opens the link will see your schedule — no account needed on their end either." } },
        { "@type": "Question", "name": "How do I print my schedule?", "acceptedAnswer": { "@type": "Answer", "text": "Click Export to download your schedule as a high-resolution PNG image. You can then print it directly or paste it into a document." } },
        { "@type": "Question", "name": "Does it detect schedule conflicts?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. If two classes overlap on the same day, the tool highlights them and shows a warning banner so you can resolve the conflict." } },
        { "@type": "Question", "name": "Can I add weekend classes?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — check the 'Show weekends' box to add Saturday and Sunday columns to your schedule grid." } }
      ]
    });
    document.head.appendChild(ld);

    return () => {
      document.head.removeChild(ld);
      document.title = 'ClassroomBuilder — Free Tools for Teachers & Students';
    };
  }, []);

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

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

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

        <ScheduleMakerTool showInlineActions />

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

          {/* Schedule Builder / Creator / Generator cluster */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">Build a Weekly Schedule in Seconds</h2>
            <p className="mb-2">
              This free schedule builder helps students and teachers quickly create a clear weekly class schedule. Instead of writing your timetable by hand, you can use the schedule creator to visually map out your classes, activities, and study time.
            </p>
            <p>
              Many students use a schedule generator like this during course registration to test different class combinations before finalizing their semester schedule.
            </p>
          </div>

          {/* FAQs */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full -mt-2">
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
              <AccordionItem value="faq-6" className="border-b-0">
                <AccordionTrigger className="text-foreground text-left">Can I add weekend classes?</AccordionTrigger>
                <AccordionContent>
                  Yes — check the "Show weekends" box to add Saturday and Sunday columns to your schedule grid.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Internal Links */}
          <div className="pt-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">More Free Teacher & Student Tools</h2>
            <p className="mb-4">
              ClassroomBuilder offers a growing set of free tools designed for teachers and students. Check out our other tools:
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/random-group-generator" className="group block rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  Random Group Generator
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Split your class into fair, randomized groups with smart pair avoidance. Drag-and-drop editing and CSV export — free for teachers.
                </p>
              </Link>
              <Link to="/random-name-picker" className="group block rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  Random Name Picker
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Randomly pick one or more students from your class list with a fun spin animation. Great for participation and games.
                </p>
              </Link>
              <Link to="/seating-chart-generator" className="group block rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  Seating Chart Generator
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Create a randomized classroom seating chart with drag-and-drop editing, lock seats, and PNG export.
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
