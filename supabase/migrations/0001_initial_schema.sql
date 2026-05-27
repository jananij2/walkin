create extension if not exists "uuid-ossp";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.closet_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null check (category in ('top', 'bottom', 'dress', 'outerwear', 'shoe', 'accessory', 'other')),
  image_path text not null,
  colors text[] not null default '{}',
  notes text,
  tags text[] not null default '{}',
  ai_metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inspiration_sources (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('pinterest_board', 'image_upload', 'manual_note')),
  source_url text,
  image_path text,
  extracted_themes text[] not null default '{}',
  ai_summary text,
  created_at timestamptz not null default now()
);

create table public.style_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  themes text[] not null default '{}',
  preferred_colors text[] not null default '{}',
  avoided_items text[] not null default '{}',
  occasions text[] not null default '{}',
  notes text,
  updated_at timestamptz not null default now()
);

create table public.outfits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  closet_item_ids uuid[] not null default '{}',
  styling_notes text not null,
  occasions text[] not null default '{}',
  saved boolean not null default false,
  ai_rationale text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.closet_items enable row level security;
alter table public.inspiration_sources enable row level security;
alter table public.style_profiles enable row level security;
alter table public.outfits enable row level security;

create policy "Users can manage own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users can manage own closet items" on public.closet_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own inspiration sources" on public.inspiration_sources
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own style profile" on public.style_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own outfits" on public.outfits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
