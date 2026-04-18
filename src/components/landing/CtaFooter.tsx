import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { ArrowRight } from "lucide-react";

export function CtaFooter() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-hero bg-grain border border-gold/30 p-12 md:p-20 text-center shadow-luxe">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full blur-3xl opacity-40 animate-drift"
              style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }}
            />
            <h2 className="relative font-display text-5xl md:text-7xl lg:text-8xl">
              Start your <span className="italic shimmer-gold">journey</span> today.
            </h2>
            <p className="relative mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
              Join Collabry — where influence becomes income and brands find their voice.
            </p>
            <div className="relative mt-10">
              <Link to="/auth">
                <Button size="lg" className="rounded-full px-10 h-12 text-base shadow-luxe">
                  Create your account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
