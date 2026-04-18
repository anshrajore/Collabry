import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile-setup")({
  component: ProfileSetup,
  head: () => ({ meta: [{ title: "Profile · Collabry" }] }),
});

function ProfileSetup() {
  const { user, role } = useAuth();
  const isBrand = role === "brand";
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "", followers: 0, engagement_rate: 0, niche: "", brand_name: "", website: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (data) setForm({
      name: data.name ?? "",
      bio: data.bio ?? "",
      followers: data.followers ?? 0,
      engagement_rate: Number(data.engagement_rate ?? 0),
      niche: data.niche ?? "",
      brand_name: data.brand_name ?? "",
      website: data.website ?? "",
    });
  }, [data]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update(form).eq("id", user.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile saved");
  };

  if (isLoading) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-5xl text-gradient mb-2">Your profile</h1>
      <p className="text-muted-foreground mb-8">{isBrand ? "Help creators recognize your brand." : "Sharpen your match — tell us about your audience."}</p>

      <Card className="rounded-2xl border-border/60 bg-card-luxe p-6 md:p-8 space-y-5">
        <Field label="Display name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Bio"><Textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></Field>

        {isBrand ? (
          <>
            <Field label="Brand name"><Input value={form.brand_name} onChange={(e) => setForm({ ...form, brand_name: e.target.value })} /></Field>
            <Field label="Website"><Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://" /></Field>
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Followers"><Input type="number" value={form.followers} onChange={(e) => setForm({ ...form, followers: Number(e.target.value) })} /></Field>
            <Field label="Engagement rate (%)"><Input type="number" step="0.1" value={form.engagement_rate} onChange={(e) => setForm({ ...form, engagement_rate: Number(e.target.value) })} /></Field>
            <div className="sm:col-span-2">
              <Field label="Niche"><Input value={form.niche} onChange={(e) => setForm({ ...form, niche: e.target.value })} placeholder="Fashion, Beauty, Tech…" /></Field>
            </div>
          </div>
        )}

        <Button onClick={save} disabled={saving} className="rounded-full h-11 px-8">
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save profile
        </Button>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
