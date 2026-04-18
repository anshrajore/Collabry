import { Reveal } from "@/components/site/Reveal";
import { UserCircle2, Send, Wallet } from "lucide-react";

const steps = [
  {
    icon: UserCircle2,
    title: "Create Profile",
    desc: "Showcase your craft, audience and rates. A signature page that brands fall for.",
  },
  {
    icon: Send,
    title: "Apply to Campaigns",
    desc: "Browse curated opportunities. Send proposals. Get matched by our AI.",
  },
  {
    icon: Wallet,
    title: "Earn Money",
    desc: "Sign secure deals, deliver content, and get paid — directly to your wallet.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">The Journey</p>
            <h2 className="mt-4 font-display text-5xl md:text-7xl">
              Three steps to your <span className="italic shimmer-gold">first deal</span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="group relative h-full rounded-2xl bg-card-luxe border border-border/60 p-8 shadow-soft hover:shadow-luxe transition-all hover:-translate-y-1">
                <div className="absolute top-6 right-6 font-display text-5xl text-muted/40">
                  0{i + 1}
                </div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-display text-2xl">{s.title}</h3>
                <p className="mt-3 text-muted-foreground">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
