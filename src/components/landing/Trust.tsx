import { Reveal } from "@/components/site/Reveal";

const brands = ["LUMIÈRE", "VELVÉ", "AURUM", "MAISON", "OBSIDIAN", "ÉCLAT"];

export function Trust() {
  return (
    <section id="trust" className="border-y border-border/50 bg-card/30 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Trusted by visionary brands
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center">
          {brands.map((b, i) => (
            <Reveal key={b} delay={i * 0.05}>
              <div className="font-display text-xl md:text-2xl text-center text-muted-foreground/80 hover:text-foreground transition tracking-widest">
                {b}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <Reveal>
            <div className="text-center">
              <div className="font-display text-5xl md:text-6xl text-gradient">10K+</div>
              <div className="mt-2 text-sm text-muted-foreground">Verified Influencers</div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="text-center">
              <div className="font-display text-5xl md:text-6xl text-gradient">500+</div>
              <div className="mt-2 text-sm text-muted-foreground">Premium Brands</div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
