-- Enable realtime for notifications table
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Allow inserts so triggers + app can create notifications
CREATE POLICY "System can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (true);

-- Trigger: notify brand when an influencer applies
CREATE OR REPLACE FUNCTION public.notify_on_application()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _brand_id uuid;
  _campaign_title text;
  _influencer_name text;
BEGIN
  SELECT brand_id, title INTO _brand_id, _campaign_title
  FROM public.campaigns WHERE id = NEW.campaign_id;

  SELECT COALESCE(name, 'A creator') INTO _influencer_name
  FROM public.profiles WHERE id = NEW.influencer_id;

  IF _brand_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, type, title, body)
    VALUES (_brand_id, 'application',
      'New application',
      _influencer_name || ' applied to ' || COALESCE(_campaign_title, 'your campaign'));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_application_created
AFTER INSERT ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.notify_on_application();

-- Trigger: notify influencer when application status changes
CREATE OR REPLACE FUNCTION public.notify_on_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _campaign_title text;
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    SELECT title INTO _campaign_title FROM public.campaigns WHERE id = NEW.campaign_id;
    INSERT INTO public.notifications (user_id, type, title, body)
    VALUES (NEW.influencer_id, 'status_change',
      'Application ' || NEW.status,
      'Your application to ' || COALESCE(_campaign_title, 'a campaign') || ' was ' || NEW.status || '.');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_application_status_change
AFTER UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.notify_on_status_change();