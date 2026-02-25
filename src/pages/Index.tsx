import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Download, Palette, Share2, Zap, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import { useEffect } from 'react';

const tools = [
  {
    icon: Calendar,
    title: 'Schedule Builder',
    desc: 'Create a color-coded weekly class schedule. Export as PNG, share via link — no sign-up needed.',
    to: '/builder',
    cta: 'Build a Schedule',
  },
  {
    icon: Users,
    title: 'Group Generator',
    desc: 'Randomly split students into groups with drag-and-drop reordering, pair history, and CSV export.',
    to: '/random-group-generator',
    cta: 'Generate Groups',
  },
];

const features = [
  { icon: Zap, title: '100% Free', desc: 'Every tool is completely free — no hidden fees, no premium tier.' },
  { icon: Shield, title: 'Private & Local', desc: 'Your data stays in your browser. No accounts, no tracking, no cloud.' },
  { icon: Palette, title: 'Beautiful & Accessible', desc: 'Color-coded, high-contrast, keyboard-navigable tools built for everyone.' },
  { icon: Download, title: 'Export Anywhere', desc: 'Download PNGs, PDFs, CSVs — take your work wherever you need it.' },
  { icon: Share2, title: 'Instant Sharing', desc: 'Generate a link to share your work with classmates — no account required.' },
];

const Index = () => {
  useEffect(() => {
    document.title = 'ClassroomBuilder — Free Tools for Students & Teachers';
    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('description', 'Free classroom tools for students and teachers. Build color-coded schedules, generate random groups, and more — no sign-up required.');
    setMeta('keywords', 'classroom tools, student tools, teacher tools, schedule maker, group generator, free education tools');
    setMeta('og:title', 'ClassroomBuilder — Free Tools for Students & Teachers', 'property');
    setMeta('og:description', 'Free classroom tools for students and teachers. Build schedules, generate groups, and more — no sign-up required.', 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:url', 'https://classroombuilder.com', 'property');
    setMeta('twitter:title', 'ClassroomBuilder — Free Tools for Students & Teachers');
    setMeta('twitter:description', 'Free classroom tools for students and teachers. Build schedules, generate groups, and more — no sign-up required.');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 inset-x-0 z-50">
        <AppHeader />
      </div>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.12),transparent_60%)]" />
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <Zap className="h-3.5 w-3.5" aria-hidden="true" /> 100% Free · No Sign-Up
              </span>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Classroom tools,
                <br />
                <span className="text-primary">beautifully simple.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
                A growing set of free tools for students and teachers — from schedule builders to group generators. No accounts, no clutter, just what you need.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tools */}
        <section className="py-20 md:py-28 bg-muted/40" aria-labelledby="tools-heading">
          <div className="container mx-auto px-4">
            <h2 id="tools-heading" className="text-center text-3xl font-bold sm:text-4xl mb-4">
              Pick a tool, get to work.
            </h2>
            <p className="text-center text-muted-foreground max-w-xl mx-auto mb-14">
              Every tool runs in your browser, saves locally, and is ready in seconds.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
              {tools.map((t, i) => (
                <motion.div
                  key={t.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <t.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{t.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{t.desc}</p>
                  <Button asChild size="sm" variant="outline" className="w-fit rounded-full">
                    <Link to={t.to}>
                      {t.cta} <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 md:py-28" aria-labelledby="features-heading">
          <div className="container mx-auto px-4">
            <h2 id="features-heading" className="text-center text-3xl font-bold sm:text-4xl mb-4">
              Why ClassroomBuilder?
            </h2>
            <p className="text-center text-muted-foreground max-w-xl mx-auto mb-14">
              Built for students and teachers who want fast, beautiful tools without the bloat.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <f.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-muted/40">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              Jump into any tool — it takes under a minute and everything stays right in your browser.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/25">
                <Link to="/builder">
                  <Calendar className="mr-2 h-5 w-5" aria-hidden="true" /> Build a Schedule
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-12 text-base">
                <Link to="/random-group-generator">
                  <Users className="mr-2 h-5 w-5" aria-hidden="true" /> Generate Groups
                </Link>
              </Button>
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

export default Index;
