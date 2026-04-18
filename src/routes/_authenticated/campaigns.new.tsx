import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/campaigns/new")({
  component: NewCampaign,
  head: () => ({ meta: [{ title: "Create campaign · Collabry" }] }),
});

const schema = z.object({
  title: z.string().trim().min(3, "Title required").max(120),
  description: z.string().trim().min(20, "At least 20 characters").max(2000),
  category: z.string().min(1, "Pick a category"),
  budget: z.coerce.number().positive("Budget must be > 0"),
  deadline: z.string().min(1, "Deadline required"),
  deliverables: z.string().max(500).optional(),
  cover_url: z.string().url().optional().or(z.literal("")),
});
type Values = z.infer<typeof schema>;

function NewCampaign() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "", category: "", budget: 0, deadline: "", deliverables: "", cover_url: "" },
  });

  if (role && role !== "brand") {
    return <Card className="p-12 text-center rounded-2xl">Only brand accounts can create campaigns.</Card>;
  }

  const onSubmit = async (v: Values) => {
    if (!user) return;
    setLoading(true);
    const { data: profile } = await supabase.from("profiles").select("brand_name, name").eq("id", user.id).maybeSingle();
    const brandName = profile?.brand_name || profile?.name || user.email?.split("@")[0] || "Brand";
    const { error } = await supabase.from("campaigns").insert({
      brand_id: user.id,
      brand_name: brandName,
      title: v.title,
      description: v.description,
      category: v.category,
      budget: v.budget,
      deadline: v.deadline,
      deliverables: v.deliverables || null,
      cover_url: v.cover_url || null,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Campaign created!");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-5xl text-gradient mb-2">Create campaign</h1>
      <p className="text-muted-foreground mb-8">Define your collaboration brief and reach top creators.</p>

      <Card className="rounded-2xl border-border/60 bg-card-luxe p-6 md:p-8 shadow-soft">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Field label="Title" error={form.formState.errors.title?.message}>
            <Input {...form.register("title")} placeholder="Spring Drop — Reels Campaign" />
          </Field>
          <Field label="Description" error={form.formState.errors.description?.message}>
            <Textarea rows={6} {...form.register("description")} placeholder="What you need, audience fit, brand voice…" />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Category" error={form.formState.errors.category?.message}>
              <Select onValueChange={(v) => form.setValue("category", v, { shouldValidate: true })}>
                <SelectTrigger><SelectValue placeholder="Pick category" /></SelectTrigger>
                <SelectContent>
                  {["Fashion", "Beauty", "Tech", "Music", "Entertainment", "Lifestyle"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Budget (₹)" error={form.formState.errors.budget?.message}>
              <Input type="number" min={1} {...form.register("budget")} />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Deadline" error={form.formState.errors.deadline?.message}>
              <Input type="date" {...form.register("deadline")} />
            </Field>
            <Field label="Cover image URL (optional)" error={form.formState.errors.cover_url?.message}>
              <Input {...form.register("cover_url")} placeholder="https://…" />
            </Field>
          </div>

          <Field label="Deliverables (optional)" error={form.formState.errors.deliverables?.message}>
            <Textarea rows={2} {...form.register("deliverables")} placeholder="2 Reels + 3 Stories" />
          </Field>

          <Button type="submit" disabled={loading} className="w-full rounded-full h-11">
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Publish campaign
          </Button>
        </form>
      </Card>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
