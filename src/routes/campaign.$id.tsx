import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { fetchCampaign } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Calendar, IndianRupee, Loader2, ArrowLeft, Tag, Package } from "lucide-react";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/campaign/$id")({
  component: CampaignDetail,
});

function CampaignDetail() {
  const { id } = Route.useParams();
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [proposal, setProposal] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading } = useQuery({ queryKey: ["campaign", id], queryFn: () => fetchCampaign(id) });
  const existing = useQuery({
    queryKey: ["my-app", id, user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase.from("applications").select("*").eq("campaign_id", id).eq("influencer_id", user!.id).maybeSingle();
      return data;
    },
  });

  const apply = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in required");
      const { error } = await supabase.from("applications").insert({
        campaign_id: id,
        influencer_id: user.id,
        proposal,
        expected_price: Number(price),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Application submitted!");
      qc.invalidateQueries({ queryKey: ["my-app", id] });
      setOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const handleApply = async () => {
    if (!user) { navigate({ to: "/auth" }); return; }
    if (!proposal.trim() || !price) { toast.error("Fill all fields"); return; }
    setSubmitting(true);
    await apply.mutateAsync();
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background bg-grain">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        <Link to="/campaigns" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> All campaigns
        </Link>

        {isLoading ? (
          <Skeleton className="h-96 rounded-3xl" />
        ) : !data ? (
          <Card className="p-16 text-center rounded-2xl">Campaign not found.</Card>
        ) : (
          <>
            {data.cover_url && (
              <div className="overflow-hidden rounded-3xl mb-8 aspect-[21/9]">
                <img src={data.cover_url} alt={data.title} className="h-full w-full object-cover" />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <p className="text-xs uppercase tracking-[0.2em] text-gold">{data.brand_name}</p>
                <h1 className="font-display text-5xl md:text-6xl text-gradient mt-2">{data.title}</h1>
                <p className="text-muted-foreground mt-6 leading-relaxed whitespace-pre-line">{data.description}</p>

                {data.deliverables && (
                  <div className="mt-8">
                    <h3 className="font-display text-2xl mb-2">Deliverables</h3>
                    <p className="text-muted-foreground">{data.deliverables}</p>
                  </div>
                )}
              </div>

              <Card className="rounded-2xl border-border/60 bg-card-luxe p-6 shadow-soft h-fit lg:sticky lg:top-24">
                <Detail icon={IndianRupee} label="Budget" value={inr(data.budget)} />
                <Detail icon={Calendar} label="Deadline" value={new Date(data.deadline).toLocaleDateString()} />
                <Detail icon={Tag} label="Category" value={data.category} />
                <Detail icon={Package} label="Brand" value={data.brand_name} />

                {!user ? (
                  <Link to="/auth">
                    <Button className="w-full rounded-full mt-4 h-11">Sign in to apply</Button>
                  </Link>
                ) : role === "brand" ? (
                  <p className="text-xs text-muted-foreground mt-4 text-center">Switch to a creator account to apply.</p>
                ) : existing.data ? (
                  <Button disabled className="w-full rounded-full mt-4 h-11 capitalize">
                    Already applied · {existing.data.status}
                  </Button>
                ) : (
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full rounded-full mt-4 h-11">Apply now</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Apply to {data.title}</DialogTitle></DialogHeader>
                      <div className="space-y-4 mt-2">
                        <div>
                          <Label htmlFor="proposal">Your proposal</Label>
                          <Textarea id="proposal" rows={5} value={proposal} onChange={(e) => setProposal(e.target.value)} placeholder="Why you, your reach, your idea…" />
                        </div>
                        <div>
                          <Label htmlFor="price">Expected price (₹)</Label>
                          <Input id="price" type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} />
                        </div>
                        <Button onClick={handleApply} disabled={submitting} className="w-full rounded-full h-11">
                          {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          Submit application
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/40 last:border-0">
      <Icon className="h-4 w-4 text-gold" />
      <div className="flex-1 flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
    </div>
  );
}
