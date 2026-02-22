import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Palette, Share2, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import AppHeader from '@/components/AppHeader';

const features = [
  { icon: Palette, title: 'Color-Coded', desc: 'Each class gets a unique color so you can read your week at a glance.' },
  { icon: Download, title: 'Export & Print', desc: 'Download your schedule as a PNG or PDF — perfect for your binder or phone.' },
  { icon: Share2, title: 'Share Instantly', desc: 'Generate a link to share your schedule with friends — no account needed.' },
  { icon: Shield, title: 'Private & Local', desc: 'Your data stays in your browser. No sign-up, no tracking, no cloud.' },
  { icon: Zap, title: 'Group Generator', desc: 'Randomly split students into groups with drag-and-drop and pair history.' },
];

const Index = () => {
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
                Your week,
                <br />
                <span className="text-primary">beautifully organized.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
                Build a color-coded class schedule in seconds. Export it, share it, keep it — all without creating an account.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="text-base px-8 h-12 rounded-full shadow-lg shadow-primary/25">
                  <Link to="/builder">
                    <Calendar className="mr-2 h-5 w-5" aria-hidden="true" /> Create Your Schedule
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 md:py-28 bg-muted/40" aria-labelledby="features-heading">
          <div className="container mx-auto px-4">
            <h2 id="features-heading" className="text-center text-3xl font-bold sm:text-4xl mb-4">
              Everything you need, nothing you don't.
            </h2>
            <p className="text-center text-muted-foreground max-w-xl mx-auto mb-14">
              Designed for students who want a fast, beautiful schedule without the bloat.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
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
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">Ready to plan your week?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              Jump in and build your schedule — it takes under a minute.
            </p>
            <Button asChild size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/25">
              <Link to="/builder">Get Started — It's Free</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ClassGrid. Built for students, by students.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
