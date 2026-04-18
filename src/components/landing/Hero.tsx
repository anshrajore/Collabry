import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero bg-grain">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-32 h-[560px] w-[560px] rounded-full blur-3xl animate-drift"
        style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -right-40 h-[620px] w-[620px] rounded-full blur-3xl animate-drift-slow"
        style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-6xl px-6 pt-28 pb-36 text-center">
        <div className="reveal inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card/40 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-gold backdrop-blur shadow-gold">
          <Sparkles className="h-3.5 w-3.5" />
          Luxury creator economy
        </div>

        <h1 className="reveal reveal-delay-1 mt-10 font-display leading-[0.9] text-6xl sm:text-7xl md:text-8xl lg:text-[9rem]">
          Turn Your Influence
          <br />
          <span className="italic shimmer-gold">Into Income.</span>
        </h1>

        <p className="reveal reveal-delay-2 mx-auto mt-10 max-w-2xl text-lg md:text-xl text-muted-foreground">
          Connect with iconic brands. Monetize your content. Collabry pairs creators and
          companies through intelligent matching, secure deals, and real-time collaboration.
        </p>

        <div className="reveal reveal-delay-3 mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/auth">
            <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-gold">
              Join as Influencer
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/auth">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-12 text-base bg-card/40 backdrop-blur border-gold/40 hover:bg-gold/10"
            >
              Hire Influencers
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
