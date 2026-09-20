-- Enable the UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define issue types
-- 'infrastructure', 'safety', 'child_welfare', 'environment', 'other'
-- Define status
-- 'reported', 'in_progress', 'resolved'

-- Create the reports table
CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text CHECK (type IN ('infrastructure', 'safety', 'child_welfare', 'environment', 'other')),
  description text NOT NULL,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  photo_url text,
  status text DEFAULT 'reported' CHECK (status IN ('reported', 'in_progress', 'resolved')),
  user_id uuid REFERENCES auth.users(id),
  user_email text,
  created_at timestamptz DEFAULT now()
);

-- Create the confirmations table ("Me too" feature)
CREATE TABLE confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES reports(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(report_id, user_id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE confirmations ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------
-- POLICIES FOR REPORTS
-- ----------------------------------------------------

-- 1. Everyone can select/read reports (public map)
CREATE POLICY "Public can view reports"
  ON reports FOR SELECT
  USING (true);

-- 2. Authenticated users can insert reports (they must own it)
CREATE POLICY "Users can create their own reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 3. Only authorities can update report statuses
CREATE POLICY "Authorities can update reports"
  ON reports FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'authority')
  WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'authority');

-- ----------------------------------------------------
-- POLICIES FOR CONFIRMATIONS
-- ----------------------------------------------------

-- 1. Everyone can read confirmations
CREATE POLICY "Public can view confirmations"
  ON confirmations FOR SELECT
  USING (true);

-- 2. Authenticated users can confirm a report
CREATE POLICY "Users can insert confirmations"
  ON confirmations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------
-- REALTIME
-- ----------------------------------------------------
-- Enable realtime for reports to show up instantly on map
alter publication supabase_realtime add table reports;

-- ----------------------------------------------------
-- STORAGE
-- ----------------------------------------------------
-- Create storage bucket for report photos
insert into storage.buckets (id, name, public) values ('report-photos', 'report-photos', true);

-- Storage policies
CREATE POLICY "Public photos are viewable by everyone"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'report-photos' );

CREATE POLICY "Authenticated users can upload photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK ( bucket_id = 'report-photos' AND auth.role() = 'authenticated' );
