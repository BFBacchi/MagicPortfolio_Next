-- Analytics page views table
create extension if not exists "pgcrypto";

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  country text,
  city text,
  referrer text,
  device text,
  browser text,
  created_at timestamptz not null default now()
);

alter table public.page_views enable row level security;

-- Anyone can insert tracking events (anon + authenticated)
drop policy if exists "insert page views for everyone" on public.page_views;
create policy "insert page views for everyone"
  on public.page_views
  for insert
  to anon, authenticated
  with check (true);

-- Only authenticated users can read analytics
drop policy if exists "read page views only authenticated" on public.page_views;
create policy "read page views only authenticated"
  on public.page_views
  for select
  to authenticated
  using (auth.uid() is not null);
