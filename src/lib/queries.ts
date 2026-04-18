import { supabase } from "@/integrations/supabase/client";

export async function fetchCampaigns(filters?: { category?: string; search?: string; minBudget?: number; maxBudget?: number }) {
  let q = supabase.from("campaigns").select("*").eq("status", "active").order("created_at", { ascending: false });
  if (filters?.category && filters.category !== "all") q = q.eq("category", filters.category);
  if (filters?.search) q = q.ilike("title", `%${filters.search}%`);
  if (filters?.minBudget) q = q.gte("budget", filters.minBudget);
  if (filters?.maxBudget) q = q.lte("budget", filters.maxBudget);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function fetchCampaign(id: string) {
  const { data, error } = await supabase.from("campaigns").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchMyApplications(userId: string) {
  const { data, error } = await supabase
    .from("applications")
    .select("*, campaigns(*)")
    .eq("influencer_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchBrandApplications(brandId: string): Promise<any[]> {
  const { data: campaigns } = await supabase.from("campaigns").select("id, title").eq("brand_id", brandId);
  if (!campaigns?.length) return [];
  const { data, error } = await supabase
    .from("applications")
    .select("*, campaigns(title, brand_name)")
    .in("campaign_id", campaigns.map((c) => c.id))
    .order("created_at", { ascending: false });
  if (error) throw error;
  const ids = Array.from(new Set((data ?? []).map((a) => a.influencer_id)));
  const profilesMap: Record<string, any> = {};
  if (ids.length) {
    const { data: profs } = await supabase.from("profiles").select("id, name, followers, niche, engagement_rate").in("id", ids);
    (profs ?? []).forEach((p: any) => { profilesMap[p.id] = p; });
  }
  return (data ?? []).map((a: any) => ({ ...a, profile: profilesMap[a.influencer_id] }));
}

export async function fetchBrandStats(brandId: string) {
  const { count: total } = await supabase.from("campaigns").select("*", { count: "exact", head: true }).eq("brand_id", brandId);
  const { count: active } = await supabase.from("campaigns").select("*", { count: "exact", head: true }).eq("brand_id", brandId).eq("status", "active");
  const { data: campaignIds } = await supabase.from("campaigns").select("id").eq("brand_id", brandId);
  let apps = 0;
  if (campaignIds?.length) {
    const { count } = await supabase.from("applications").select("*", { count: "exact", head: true }).in("campaign_id", campaignIds.map((c) => c.id));
    apps = count ?? 0;
  }
  return { total: total ?? 0, active: active ?? 0, applications: apps };
}

export async function fetchInfluencerStats(userId: string) {
  const { count: sent } = await supabase.from("applications").select("*", { count: "exact", head: true }).eq("influencer_id", userId);
  const { count: accepted } = await supabase.from("applications").select("*", { count: "exact", head: true }).eq("influencer_id", userId).eq("status", "accepted");
  const { data: acceptedDeals } = await supabase
    .from("applications")
    .select("expected_price")
    .eq("influencer_id", userId)
    .eq("status", "accepted");
  const earnings = acceptedDeals?.reduce((sum, a) => sum + Number(a.expected_price), 0) ?? 0;
  return { sent: sent ?? 0, accepted: accepted ?? 0, earnings };
}
