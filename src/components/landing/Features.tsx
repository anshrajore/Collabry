import { Reveal } from "@/components/site/Reveal";
import { Brain, MessageSquare, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Matching",
    desc: "Our engine pairs creators with campaigns by category, engagement, and audience fit — surfaced as Best Match.",
  },
  {
    icon: MessageSquare,
    title: "Real-time Chat",
    desc: "Brief, negotiate, and collaborate inside Collabry. No lost DMs, no scattered threads.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    desc: "Escrowed deals, milestone releases, and one-tap withdrawals via Stripe.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-28 bg-card/30 border-y border-border/50">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Crafted Features</p>
            <h2 className="mt-4 font-display text-5xl md:text-7xl">
              Built for the <span className="italic shimmer-gold">modern creator</span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <div className="h-full rounded-2xl bg-background/60 border border-border/60 p-8 shadow-soft hover:border-accent/40 transition">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-gold/10 text-gold">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-display text-2xl">{f.title}</h3>
                <p className="mt-3 text-muted-foreground">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
