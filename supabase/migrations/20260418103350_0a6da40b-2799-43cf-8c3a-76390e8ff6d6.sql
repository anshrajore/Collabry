
-- ============ PROFILE EXTENSIONS ============
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS followers integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS engagement_rate numeric(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS niche text,
  ADD COLUMN IF NOT EXISTS brand_name text,
  ADD COLUMN IF NOT EXISTS website text;

-- ============ CAMPAIGNS ============
CREATE TABLE IF NOT EXISTS public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  brand_name text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  budget numeric(12,2) NOT NULL CHECK (budget > 0),
  deadline date NOT NULL,
  deliverables text,
  cover_url text,
  status text NOT NULL DEFAULT 'active',
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campaigns are viewable by everyone"
  ON public.campaigns FOR SELECT USING (true);

CREATE POLICY "Brands can create their own campaigns"
  ON public.campaigns FOR INSERT
  WITH CHECK (auth.uid() = brand_id AND public.has_role(auth.uid(), 'brand'));

CREATE POLICY "Brands can update their own campaigns"
  ON public.campaigns FOR UPDATE
  USING (auth.uid() = brand_id);

CREATE POLICY "Brands can delete their own campaigns"
  ON public.campaigns FOR DELETE
  USING (auth.uid() = brand_id);

CREATE TRIGGER trg_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_campaigns_category ON public.campaigns(category);
CREATE INDEX IF NOT EXISTS idx_campaigns_brand ON public.campaigns(brand_id);

-- ============ APPLICATIONS ============
CREATE TYPE public.application_status AS ENUM ('pending', 'accepted', 'rejected');

CREATE TABLE IF NOT EXISTS public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  influencer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  proposal text NOT NULL,
  expected_price numeric(12,2) NOT NULL CHECK (expected_price >= 0),
  status public.application_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (campaign_id, influencer_id)
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Influencers see own applications"
  ON public.applications FOR SELECT
  USING (auth.uid() = influencer_id);

CREATE POLICY "Brands see applications for their campaigns"
  ON public.applications FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.brand_id = auth.uid()));

CREATE POLICY "Influencers create own applications"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = influencer_id AND public.has_role(auth.uid(), 'influencer'));

CREATE POLICY "Brands update applications for their campaigns"
  ON public.applications FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.brand_id = auth.uid()));

CREATE TRIGGER trg_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SUBMISSIONS ============
CREATE TYPE public.submission_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE IF NOT EXISTS public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  content_url text NOT NULL,
  notes text,
  status public.submission_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Influencer sees own submissions"
  ON public.submissions FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.applications a WHERE a.id = application_id AND a.influencer_id = auth.uid()));

CREATE POLICY "Brand sees submissions for their campaigns"
  ON public.submissions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.campaigns c ON c.id = a.campaign_id
    WHERE a.id = application_id AND c.brand_id = auth.uid()
  ));

CREATE POLICY "Influencer creates submissions for accepted applications"
  ON public.submissions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.applications a
    WHERE a.id = application_id AND a.influencer_id = auth.uid() AND a.status = 'accepted'
  ));

CREATE POLICY "Brand updates submission status"
  ON public.submissions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.campaigns c ON c.id = a.campaign_id
    WHERE a.id = application_id AND c.brand_id = auth.uid()
  ));

CREATE TRIGGER trg_submissions_updated_at
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ NOTIFICATIONS ============
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own notifications"
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications"
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
