import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { fetchBrandStats, fetchInfluencerStats, fetchMyApplications, fetchBrandApplications } from "@/lib/queries";
import { StatCard } from "@/components/dash/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Megaphone, CheckCircle2, Inbox, IndianRupee, Briefcase, Plus, Users, TrendingUp } from "lucide-react";
import { inr } from "@/lib/format";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard · Collabry" }] }),
});

function Dashboard() {
  const { user, role } = useAuth();
  const isBrand = role === "brand";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">{isBrand ? "Brand" : "Creator"} workspace</p>
          <h1 className="font-display text-5xl md:text-6xl text-gradient mt-2">Welcome back</h1>
        </div>
        {isBrand ? (
          <Link to="/campaigns/new">
            <Button className="rounded-full px-6 h-11"><Plus className="h-4 w-4 mr-1" /> Create campaign</Button>
          </Link>
        ) : (
          <Link to="/campaigns">
            <Button className="rounded-full px-6 h-11">Browse campaigns</Button>
          </Link>
        )}
      </div>

      {isBrand ? <BrandView userId={user!.id} /> : <InfluencerView userId={user!.id} />}
    </div>
  );
}

function BrandView({ userId }: { userId: string }) {
  const stats = useQuery({ queryKey: ["brand-stats", userId], queryFn: () => fetchBrandStats(userId) });
  const apps = useQuery<any[]>({ queryKey: ["brand-apps", userId], queryFn: () => fetchBrandApplications(userId) });

  if (stats.isLoading) return <StatsSkeleton />;

  const chartData = [
    { name: "Total", value: stats.data?.total ?? 0 },
    { name: "Active", value: stats.data?.active ?? 0 },
    { name: "Apps", value: stats.data?.applications ?? 0 },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total campaigns" value={stats.data?.total ?? 0} icon={Briefcase} />
        <StatCard label="Active" value={stats.data?.active ?? 0} icon={Megaphone} />
        <StatCard label="Applications" value={stats.data?.applications ?? 0} icon={Inbox} />
        <StatCard label="Avg apps/campaign" value={stats.data?.total ? Math.round((stats.data.applications / stats.data.total) * 10) / 10 : 0} icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <Card className="lg:col-span-2 rounded-2xl border-border/60 bg-card-luxe p-6 shadow-soft">
          <h3 className="font-display text-2xl mb-4">Performance</h3>
          <ChartContainer config={{ value: { label: "Count", color: "hsl(var(--primary))" } }} className="h-[260px]">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--gold)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </Card>
        <ActivityList items={(apps.data ?? []).slice(0, 6).map((a: any) => ({
          title: a.profile?.name ?? "Influencer",
          sub: `applied to ${a.campaigns?.title}`,
          status: a.status,
        }))} title="Recent applicants" />
      </div>
    </>
  );
}

function InfluencerView({ userId }: { userId: string }) {
  const stats = useQuery({ queryKey: ["inf-stats", userId], queryFn: () => fetchInfluencerStats(userId) });
  const apps = useQuery({ queryKey: ["my-apps", userId], queryFn: () => fetchMyApplications(userId) });

  if (stats.isLoading) return <StatsSkeleton />;

  const chartData = [
    { name: "Sent", value: stats.data?.sent ?? 0 },
    { name: "Accepted", value: stats.data?.accepted ?? 0 },
    { name: "Earnings/100", value: Math.round((stats.data?.earnings ?? 0) / 100) },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Applications sent" value={stats.data?.sent ?? 0} icon={Inbox} />
        <StatCard label="Accepted deals" value={stats.data?.accepted ?? 0} icon={CheckCircle2} />
        <StatCard label="Earnings" value={inr(stats.data?.earnings ?? 0)} icon={IndianRupee} />
        <StatCard label="Acceptance rate" value={stats.data?.sent ? `${Math.round(((stats.data.accepted ?? 0) / stats.data.sent) * 100)}%` : "—"} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <Card className="lg:col-span-2 rounded-2xl border-border/60 bg-card-luxe p-6 shadow-soft">
          <h3 className="font-display text-2xl mb-4">Your activity</h3>
          <ChartContainer config={{ value: { label: "Value", color: "hsl(var(--primary))" } }} className="h-[260px]">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--gold)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </Card>
        <ActivityList items={(apps.data ?? []).slice(0, 6).map((a: any) => ({
          title: a.campaigns?.title ?? "Campaign",
          sub: `${a.campaigns?.brand_name} · ${inr(a.expected_price)}`,
          status: a.status,
        }))} title="Recent applications" />
      </div>
    </>
  );
}

function ActivityList({ items, title }: { items: { title: string; sub: string; status: string }[]; title: string }) {
  return (
    <Card className="rounded-2xl border-border/60 bg-card-luxe p-6 shadow-soft">
      <h3 className="font-display text-2xl mb-4">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((it, i) => (
            <li key={i} className="flex items-start justify-between gap-3 text-sm">
              <div className="min-w-0">
                <p className="font-medium truncate">{it.title}</p>
                <p className="text-xs text-muted-foreground truncate">{it.sub}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                it.status === "accepted" ? "bg-emerald-500/15 text-emerald-500" :
                it.status === "rejected" ? "bg-destructive/15 text-destructive" :
                "bg-gold/15 text-gold"
              }`}>{it.status}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[0,1,2,3].map((i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
    </div>
  );
}
