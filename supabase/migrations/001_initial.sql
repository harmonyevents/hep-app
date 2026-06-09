-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis"; -- for geo queries

-- Users (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  phone text unique,
  email text,
  name text not null default '',
  role text not null default 'consumer' check (role in ('consumer','vendor','admin')),
  avatar_url text,
  preferred_language text default 'en' check (preferred_language in ('en','ta')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "profiles: own read" on public.profiles for select using (auth.uid() = id);
create policy "profiles: own update" on public.profiles for update using (auth.uid() = id);
create policy "profiles: insert own" on public.profiles for insert with check (auth.uid() = id);

-- Vendor profiles
create table public.vendors (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  business_name text not null,
  tagline text,
  categories text[] not null default '{}',
  description text,
  gstin text,
  pan text,
  is_kyc_verified boolean default false,
  subscription_tier text default 'basic' check (subscription_tier in ('basic','pro','elite')),
  avg_rating numeric(3,2) default 0,
  total_reviews int default 0,
  total_events int default 0,
  reliability_score int default 100,
  response_time_hours int default 24,
  portfolio jsonb default '[]',
  packages jsonb default '[]',
  service_areas text[],
  lat numeric(10,7),
  lng numeric(10,7),
  city text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.vendors enable row level security;
create policy "vendors: public read" on public.vendors for select using (true);
create policy "vendors: own update" on public.vendors for update using (auth.uid() = user_id);
create policy "vendors: own insert" on public.vendors for insert with check (auth.uid() = user_id);

-- Events
create table public.events (
  id uuid primary key default uuid_generate_v4(),
  consumer_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  type text not null,
  date timestamptz not null,
  duration_hours int not null default 4,
  guest_count int not null,
  venue_name text,
  venue_address text not null,
  lat numeric(10,7),
  lng numeric(10,7),
  budget_min int not null,
  budget_max int not null,
  categories_needed text[] default '{}',
  notes text,
  status text default 'open' check (status in ('open','in_progress','completed','cancelled')),
  visibility text default 'public' check (visibility in ('public','invite_only')),
  bid_deadline timestamptz,
  ai_suggestions jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.events enable row level security;
create policy "events: public read open" on public.events for select using (status = 'open' or auth.uid() = consumer_id);
create policy "events: own insert" on public.events for insert with check (auth.uid() = consumer_id);
create policy "events: own update" on public.events for update using (auth.uid() = consumer_id);

-- Bids
create table public.bids (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade not null,
  vendor_id uuid references public.vendors(id) on delete cascade not null,
  category text not null,
  price int not null,
  advance_percent int default 30,
  message text,
  portfolio_samples jsonb default '[]',
  package_id text,
  status text default 'pending' check (status in ('pending','accepted','declined','counter','withdrawn','expired')),
  counter_price int,
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(event_id, vendor_id, category)
);
alter table public.bids enable row level security;
create policy "bids: event owner read" on public.bids for select using (
  auth.uid() = vendor_id or
  auth.uid() in (select consumer_id from public.events where id = event_id)
);
create policy "bids: vendor insert" on public.bids for insert with check (
  auth.uid() = vendor_id
);
create policy "bids: own update" on public.bids for update using (
  auth.uid() = vendor_id or
  auth.uid() in (select consumer_id from public.events where id = event_id)
);

-- Bookings
create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) not null,
  bid_id uuid references public.bids(id) not null unique,
  consumer_id uuid references public.profiles(id) not null,
  vendor_id uuid references public.vendors(id) not null,
  total_amount int not null,
  advance_amount int not null,
  balance_amount int not null,
  commission_amount int not null,
  advance_paid_at timestamptz,
  balance_paid_at timestamptz,
  razorpay_order_id text,
  razorpay_payment_id text,
  status text default 'bid_accepted' check (status in ('bid_accepted','advance_paid','in_progress','completed','cancelled','disputed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.bookings enable row level security;
create policy "bookings: parties read" on public.bookings for select using (
  auth.uid() = consumer_id or auth.uid() = vendor_id
);
create policy "bookings: consumer insert" on public.bookings for insert with check (auth.uid() = consumer_id);
create policy "bookings: parties update" on public.bookings for update using (
  auth.uid() = consumer_id or auth.uid() = vendor_id
);

-- Reviews
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references public.bookings(id) not null unique,
  reviewer_id uuid references public.profiles(id) not null,
  vendor_id uuid references public.vendors(id) not null,
  rating_overall numeric(3,1) not null,
  rating_punctuality numeric(3,1),
  rating_quality numeric(3,1),
  rating_communication numeric(3,1),
  rating_value numeric(3,1),
  comment text,
  is_public boolean default true,
  created_at timestamptz default now()
);
alter table public.reviews enable row level security;
create policy "reviews: public read" on public.reviews for select using (is_public = true);
create policy "reviews: own insert" on public.reviews for insert with check (auth.uid() = reviewer_id);

-- Notifications
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  title text not null,
  body text not null,
  action_path text,
  is_read boolean default false,
  created_at timestamptz default now()
);
alter table public.notifications enable row level security;
create policy "notifications: own" on public.notifications for all using (auth.uid() = user_id);

-- Trigger: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, phone, email, name)
  values (
    new.id,
    new.phone,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function: update vendor rating on new review
create or replace function public.update_vendor_rating()
returns trigger language plpgsql as $$
begin
  update public.vendors
  set
    avg_rating = (select avg(rating_overall) from public.reviews where vendor_id = new.vendor_id),
    total_reviews = (select count(*) from public.reviews where vendor_id = new.vendor_id)
  where id = new.vendor_id;
  return new;
end;
$$;
create trigger on_review_created
  after insert on public.reviews
  for each row execute procedure public.update_vendor_rating();
