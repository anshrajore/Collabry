import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { fetchMyApplications, fetchBrandApplications } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/applications")({
  component: ApplicationsPage,
  head: () => ({ meta: [{ title: "Applications · Collabry" }] }),
});

function ApplicationsPage() {
  const { user, role } = useAuth();
  const isBrand = role === "brand";

  const { data, isLoading } = useQuery<any[]>({
    queryKey: ["apps", user?.id, role],
    enabled: !!user?.id,
    queryFn: () => isBrand ? fetchBrandApplications(user!.id) : fetchMyApplications(user!.id) as any,
  });

  const [tab, setTab] = useState("pending");
  const filtered = (data ?? []).filter((a: any) => a.status === tab);

  return (
    <div>
      <h1 className="font-display text-5xl text-gradient mb-2">{isBrand ? "Applicants" : "My Applications"}</h1>
      <p className="text-muted-foreground mb-6">{isBrand ? "Review and respond to creator applications." : "Track your applications across all campaigns."}</p>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="rounded-full">
          {["pending", "accepted", "rejected"].map((s) => (
            <TabsTrigger key={s} value={s} className="rounded-full capitalize">{s}</TabsTrigger>
          ))}
        </TabsList>

        {["pending", "accepted", "rejected"].map((s) => (
          <TabsContent key={s} value={s} className="mt-6 space-y-3">
            {isLoading ? (
              <Skeleton className="h-32 rounded-2xl" />
            ) : filtered.length === 0 ? (
              <Card className="p-12 text-center rounded-2xl border-dashed text-muted-foreground">No {s} applications.</Card>
            ) : (
              filtered.map((a: any) => isBrand ? <BrandRow key={a.id} a={a} /> : <InfRow key={a.id} a={a} />)
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function InfRow({ a }: { a: any }) {
  return (
    <Card className="rounded-2xl border-border/60 bg-card-luxe p-5 flex items-center justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-wider text-gold">{a.campaigns?.brand_name}</p>
        <h3 className="font-display text-xl">{a.campaigns?.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">Your bid: {inr(a.expected_price)}</p>
      </div>
      <span className="capitalize text-sm">{a.status}</span>
    </Card>
  );
}

function BrandRow({ a }: { a: any }) {
  const qc = useQueryClient();
  const update = useMutation({
    mutationFn: async (status: "accepted" | "rejected") => {
      const { error } = await supabase.from("applications").update({ status }).eq("id", a.id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["apps"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <Card className="rounded-2xl border-border/60 bg-card-luxe p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-gold">{a.campaigns?.title}</p>
          <h3 className="font-display text-xl">
            <Link to="/profile/$username" params={{ username: a.influencer_id }} className="hover:text-gold transition">
              {a.profile?.name ?? "Creator"}
            </Link>
          </h3>
          <p className="text-xs text-muted-foreground">
            {a.profile?.followers ? `${a.profile.followers.toLocaleString()} followers · ` : ""}
            {a.profile?.niche ?? "—"}
          </p>
          <p className="text-sm mt-3">{a.proposal}</p>
          <p className="text-sm font-medium mt-2">Bid: {inr(a.expected_price)}</p>
        </div>
        {a.status === "pending" && (
          <div className="flex flex-col gap-2 shrink-0">
            <Button size="sm" onClick={() => update.mutate("accepted")} className="rounded-full"><Check className="h-4 w-4 mr-1" />Accept</Button>
            <Button size="sm" variant="outline" onClick={() => update.mutate("rejected")} className="rounded-full"><X className="h-4 w-4 mr-1" />Reject</Button>
          </div>
        )}
      </div>
    </Card>
  );
}
