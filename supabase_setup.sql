-- ===================================================================================
-- Supabase Setup Script for AI Office Suite
-- Copy and paste this entirely into the SQL Editor in your Supabase dashboard and click "Run".
-- ===================================================================================

-- 1. Create a table for public profiles linked to Supabase Auth
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  first_name text,
  last_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Set up Row Level Security (RLS) for the profiles table
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- 3. Set up Storage for Avatars
-- Create the 'avatars' bucket if it doesn't exist (Requires superuser, or do it via Dashboard UI)
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 4. Set up RLS for Storage Bucket (avatars)
-- Note: Supabase UI will show these under Storage -> Policies
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

create policy "Anyone can update their own avatar."
  on storage.objects for update
  using ( bucket_id = 'avatars' AND auth.uid() = owner );

create policy "Anyone can delete their own avatar."
  on storage.objects for delete
  using ( bucket_id = 'avatars' AND auth.uid() = owner );

-- 5. Set up trigger to automatically create a profile for new users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', split_part(new.raw_user_meta_data->>'full_name', ' ', 1)),
    coalesce(new.raw_user_meta_data->>'last_name', split_part(new.raw_user_meta_data->>'full_name', ' ', 2)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Drop trigger if exists to prevent duplication
drop trigger if exists on_auth_user_created on auth.users;

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ===================================================================================
-- END OF SCRIPT
-- ===================================================================================
