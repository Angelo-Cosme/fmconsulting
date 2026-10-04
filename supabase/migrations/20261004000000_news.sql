-- FM Consulting — Actualités gérées depuis le dashboard /admin
-- À exécuter une fois dans Supabase : SQL Editor > New query > coller > Run.

-- ─── Administrateurs ───────────────────────────────────────────────
-- Les comptes sont gérés par Supabase Auth (email + mot de passe).
-- Seuls les utilisateurs listés ici peuvent écrire.
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

drop policy if exists "admins: lecture par les admins" on public.admins;
create policy "admins: lecture par les admins" on public.admins
  for select to authenticated using (public.is_admin());

-- ─── Articles ──────────────────────────────────────────────────────
-- cover  : {"path": "<uuid>", "width": 1600, "height": 900, "alt": "...", "widths": [480, 960, 1600]} ou null
-- content : document de l'éditeur Tiptap (JSON ProseMirror), ex.
--   {"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"..."}]}]}
--   Nœuds utilisés : paragraph, heading (2, 3), bulletList, orderedList, listItem, blockquote,
--   horizontalRule, hardBreak, image (attrs = même forme que cover), youtube (attrs.src).
--   Marques : bold, italic, underline, strike, link.
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title        text not null check (char_length(title) between 1 and 200),
  excerpt      text not null default '' check (char_length(excerpt) <= 600),
  category     text not null,
  author_name  text not null default '',
  cover        jsonb,
  content      jsonb not null default '{"type":"doc","content":[]}'::jsonb
                 check (content->>'type' = 'doc'),
  status       text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_by   uuid references auth.users(id) on delete set null default auth.uid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists posts_public_idx on public.posts (status, published_at desc);

create or replace function public.posts_before_write()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists posts_before_write on public.posts;
create trigger posts_before_write before insert or update on public.posts
  for each row execute function public.posts_before_write();

alter table public.posts enable row level security;

drop policy if exists "posts: lecture publique des articles publiés" on public.posts;
create policy "posts: lecture publique des articles publiés" on public.posts
  for select to anon, authenticated using (status = 'published' or public.is_admin());

drop policy if exists "posts: écriture par les admins" on public.posts;
create policy "posts: écriture par les admins" on public.posts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ─── Images (Supabase Storage) ─────────────────────────────────────
-- Chaque image est stockée en WebP sous news/<uuid>/<largeur>.webp (480, 960, 1600 au plus)
-- (compressée dans le navigateur avant l'envoi ; JPEG si le navigateur n'encode pas le WebP, ex. Safari).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('news', 'news', true, 2097152, array['image/webp', 'image/jpeg'])
on conflict (id) do update
  set public = true, file_size_limit = 2097152, allowed_mime_types = array['image/webp', 'image/jpeg'];

-- Lecture via l'API (nécessaire à la suppression/au remplacement ; la lecture publique passe par l'URL publique).
drop policy if exists "news: lecture par les admins" on storage.objects;
create policy "news: lecture par les admins" on storage.objects
  for select to authenticated using (bucket_id = 'news' and public.is_admin());

drop policy if exists "news: envoi par les admins" on storage.objects;
create policy "news: envoi par les admins" on storage.objects
  for insert to authenticated with check (bucket_id = 'news' and public.is_admin());

drop policy if exists "news: modification par les admins" on storage.objects;
create policy "news: modification par les admins" on storage.objects
  for update to authenticated using (bucket_id = 'news' and public.is_admin());

drop policy if exists "news: suppression par les admins" on storage.objects;
create policy "news: suppression par les admins" on storage.objects
  for delete to authenticated using (bucket_id = 'news' and public.is_admin());
