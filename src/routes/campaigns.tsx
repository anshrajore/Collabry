import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { fetchCampaigns } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Calendar, IndianRupee, Sparkles } from "lucide-react";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/campaigns")({
  component: CampaignsPage,
  head: () => ({
    meta: [
      { title: "Campaigns · Collabry" },
      { name: "description", content: "Browse active campaigns from the world's most iconic brands." },
    ],
  }),
});

const CATEGORIES = ["all", "Fashion", "Beauty", "Tech", "Music", "Entertainment", "Lifestyle"];

function CampaignsPage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [maxBudget, setMaxBudget] = useState<number | undefined>();

  const { data, isLoading } = useQuery({
    queryKey: ["campaigns", category, search, maxBudget],
    queryFn: () => fetchCampaigns({ category, search, maxBudget }),
  });

  return (
    <div className="min-h-screen bg-background bg-grain">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Live opportunities</p>
          <h1 className="font-display text-5xl md:text-7xl text-gradient mt-3">Featured Campaigns</h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Hand-picked collaborations from the world's most iconic brands.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          <aside className="lg:sticky lg:top-24 lg:self-start space-y-6">
            <Card className="rounded-2xl border-border/60 bg-card-luxe p-5">
              <h3 className="text-sm font-medium mb-3">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Title…" className="pl-9 rounded-full" />
              </div>
            </Card>

            <Card className="rounded-2xl border-border/60 bg-card-luxe p-5">
              <h3 className="text-sm font-medium mb-3">Category</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 rounded-full text-xs capitalize transition border ${
                      category === c ? "border-gold bg-gold/15 text-foreground" : "border-border/60 text-muted-foreground hover:border-border"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="rounded-2xl border-border/60 bg-card-luxe p-5">
              <h3 className="text-sm font-medium mb-3">Max budget (₹)</h3>
              <Input
                type="number"
                placeholder="₹"
                value={maxBudget ?? ""}
                onChange={(e) => setMaxBudget(e.target.value ? Number(e.target.value) : undefined)}
                className="rounded-full"
              />
            </Card>
          </aside>

          <section>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[0,1,2,3,4,5].map((i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
              </div>
            ) : !data?.length ? (
              <Card className="p-16 text-center rounded-2xl border-dashed">
                <p className="text-muted-foreground">No campaigns found. Try a different filter.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.map((c) => <CampaignCard key={c.id} c={c} />)}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function CampaignCard({ c }: { c: any }) {
  return (
    <Link to="/campaign/$id" params={{ id: c.id }} className="group">
      <Card className="overflow-hidden rounded-2xl border-border/60 bg-card-luxe shadow-soft transition hover:shadow-luxe hover:-translate-y-1 duration-300 h-full flex flex-col">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {c.cover_url && <img src={c.cover_url} alt={c.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />}
          {c.is_featured && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-gold/90 text-background px-2.5 py-1 text-xs font-medium">
              <Sparkles className="h-3 w-3" /> Best Match
            </span>
          )}
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <p className="text-xs uppercase tracking-wider text-gold">{c.brand_name}</p>
          <h3 className="font-display text-2xl mt-1 line-clamp-2">{c.title}</h3>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{c.description}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-4">
            <span className="inline-flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" /> {inr(c.budget)}</span>
            <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(c.deadline).toLocaleDateString()}</span>
            <span className="px-2 py-0.5 rounded-full bg-accent text-foreground">{c.category}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
