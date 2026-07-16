-- Run this once in your Supabase project's SQL editor.

create table if not exists permits (
  id uuid primary key,
  trek_name text not null,
  location jsonb not null,
  start_date date,
  end_date date,
  leader_name text not null,
  leader_phone text not null,
  emergency_contact text,
  created_at timestamptz not null default now()
);

create table if not exists trekkers (
  id uuid primary key default gen_random_uuid(),
  permit_id uuid not null references permits(id) on delete cascade,
  name text not null,
  age int,
  phone text,
  photo_url text
);

-- Public read access, since a scanned QR code has no login step.
-- Writes go through the anon key from the app itself; add stricter
-- policies later if you add accounts.
alter table permits enable row level security;
alter table trekkers enable row level security;

create policy "permits are publicly readable" on permits for select using (true);
create policy "permits are publicly insertable" on permits for insert with check (true);
create policy "trekkers are publicly readable" on trekkers for select using (true);
create policy "trekkers are publicly insertable" on trekkers for insert with check (true);

-- Storage: create a public bucket called "permit-photos" from the
-- Supabase dashboard (Storage → New bucket → Public), or run:
-- insert into storage.buckets (id, name, public) values ('permit-photos', 'permit-photos', true);
