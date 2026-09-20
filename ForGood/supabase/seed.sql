-- Demo Seed Data for Supabase
-- Run this in the SQL Editor after running schema.sql

-- We cannot insert auth.users directly via standard SQL insert easily without triggering auth hooks/passwords
-- in a standard Supabase project setup, so we assume the users table is populated or we bypass the foreign key
-- for the sake of demo data, or we just insert it and let it be null.
-- Actually, since it's just a demo, we can drop the foreign key constraint temporarily or insert mock UUIDs.
-- For a robust seed, let's just insert reports without valid user UUIDs, we'll cast null or valid uuids if available.
-- Here we'll generate random UUIDs for the users just so the rows insert if FK allows, but FK will fail if they don't exist.
-- 
-- ALTERNATIVE for demo: We just insert them with a specific uuid if you create them in Auth first.
-- To make this seed runnable, we will temporarily disable the foreign key check for the seed, or insert them.

ALTER TABLE reports DISABLE TRIGGER ALL;

INSERT INTO reports (id, type, description, lat, lng, status, user_email, created_at) VALUES
-- Cluster 1: Infrastructure (Hotspot) in London
(gen_random_uuid(), 'infrastructure', 'Massive pothole on the corner, causing traffic.', 51.506, -0.089, 'reported', 'citizen1@demo.com', now() - interval '1 day'),
(gen_random_uuid(), 'infrastructure', 'Water main break flooding the street.', 51.5065, -0.0888, 'reported', 'citizen2@demo.com', now() - interval '12 hours'),
(gen_random_uuid(), 'infrastructure', 'Road collapsed entirely.', 51.5055, -0.0895, 'reported', 'citizen3@demo.com', now() - interval '2 hours'),

-- Cluster 2: Safety (Hotspot)
(gen_random_uuid(), 'safety', 'Broken streetlights making the park unsafe at night.', 51.515, -0.11, 'reported', 'citizen4@demo.com', now() - interval '3 days'),
(gen_random_uuid(), 'safety', 'Vandalism on park benches.', 51.5145, -0.109, 'in_progress', 'citizen5@demo.com', now() - interval '2 days'),
(gen_random_uuid(), 'safety', 'Suspicious activity near the playground.', 51.5155, -0.111, 'reported', 'citizen6@demo.com', now() - interval '1 day'),

-- Other scattered reports
(gen_random_uuid(), 'child_welfare', 'Reports of children working in the factory during school hours.', 51.49, -0.08, 'reported', 'teacher@school.com', now() - interval '5 hours'),
(gen_random_uuid(), 'environment', 'Illegal dumping of toxic waste near the river.', 51.495, -0.05, 'resolved', 'eco@demo.com', now() - interval '1 week'),
(gen_random_uuid(), 'environment', 'Heavy smoke from an unknown source.', 51.52, -0.06, 'in_progress', 'citizen7@demo.com', now() - interval '2 days'),
(gen_random_uuid(), 'infrastructure', 'Traffic light out at intersection.', 51.51, -0.12, 'resolved', 'citizen1@demo.com', now() - interval '3 weeks');

ALTER TABLE reports ENABLE TRIGGER ALL;
