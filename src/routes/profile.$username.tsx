import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/site/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users, Sparkles, TrendingUp, Globe, ArrowLeft } from "lucide-react";
import { compact, inr } from "@/lib/format";

export const Route = createFileRoute("/profile/$username")({
  component: PublicProfile,
  head: ({ params }) => ({
    meta: [
      { title: `${params.username} · Collabry` },
      { name: "description", content: `Creator profile of ${params.username} on Collabry.` },
    ],
  }),
});

function PublicProfile() {
  const { username } = Route.useParams();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["public-profile", username],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .or(`name.eq.${username},id.eq.${username}`)
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  const { data: works } = useQuery({
    queryKey: ["public-works", profile?.id],
    enabled: !!profile?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("submissions")
        .select("*, applications!inner(influencer_id, campaigns(title, brand_name, cover_url))")
        .eq("applications.influencer_id", profile!.id)
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <div className="min-h-screen bg-background bg-grain">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        <Link to="/campaigns" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        {isLoading ? (
          <Skeleton className="h-64 rounded-3xl" />
        ) : !profile ? (
          <Card className="p-16 text-center rounded-2xl">Profile not found.</Card>
        ) : (
          <>
            <Card className="rounded-3xl border-border/60 bg-card-luxe p-8 md:p-10 shadow-soft">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <Avatar className="h-28 w-28 ring-2 ring-gold/40">
                  <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.name ?? username} />
                  <AvatarFallback className="font-display text-3xl bg-gold/10 text-gold">
                    {(profile.name ?? username).slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-gold">Creator</p>
                  <h1 className="font-display text-5xl md:text-6xl text-gradient mt-2">{profile.name ?? username}</h1>
                  {profile.niche && <Badge variant="secondary" className="mt-3 rounded-full">{profile.niche}</Badge>}
                  <p className="text-muted-foreground mt-4 max-w-2xl whitespace-pre-line">{profile.bio || "No bio yet."}</p>

                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <Stat icon={Users} label="Followers" value={compact(profile.followers)} />
                    <Stat icon={TrendingUp} label="Engagement" value={`${Number(profile.engagement_rate ?? 0).toFixed(1)}%`} />
                    <Stat icon={Sparkles} label="Niche" value={profile.niche || "—"} />
                  </div>

                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-gold mt-4 hover:underline">
                      <Globe className="h-4 w-4" /> {profile.website}
                    </a>
                  )}
                </div>
              </div>
            </Card>

            <h2 className="font-display text-3xl mt-10 mb-4">Featured work</h2>
            {!works?.length ? (
              <Card className="p-12 text-center rounded-2xl border-dashed text-muted-foreground">
                No published work yet.
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {works.map((w: any) => (
                  <a key={w.id} href={w.content_url} target="_blank" rel="noreferrer">
                    <Card className="overflow-hidden rounded-2xl border-border/60 bg-card-luxe shadow-soft hover:shadow-luxe hover:-translate-y-1 transition duration-300">
                      <div className="aspect-[4/5] bg-muted overflow-hidden">
                        {w.applications?.campaigns?.cover_url && (
                          <img src={w.applications.campaigns.cover_url} alt={w.applications.campaigns.title} className="h-full w-full object-cover" loading="lazy" />
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-xs uppercase tracking-wider text-gold">{w.applications?.campaigns?.brand_name}</p>
                        <p className="font-display text-lg mt-1 line-clamp-2">{w.applications?.campaigns?.title}</p>
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
        <p className="text-xs text-muted-foreground mt-8">Tip: showing {inr(0).replace(/[\d.,\s]/g, "")} prices in INR across the platform.</p>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/40 bg-background/40 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Icon className="h-3.5 w-3.5 text-gold" />{label}</div>
      <p className="font-display text-xl mt-1 truncate">{value}</p>
    </div>
  );
}
