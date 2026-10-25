-- FM Consulting — Contenu des pages, messages de contact et vidéos, gérés depuis /admin
-- Dépend de 20261004000000_news.sql (fonction public.is_admin, bucket « news » pour les images).

-- ─── Contenu des pages ─────────────────────────────────────────────
-- Une ligne par page (home, about, services, media, contact, settings).
-- data : { "<section>": { "visible": true, "<champ>": <valeur>, ... }, ... }
-- Le site complète les champs absents avec le contenu par défaut défini dans src/content/pages.ts.
create table if not exists public.site_content (
  page       text primary key check (page ~ '^[a-z0-9-]+$'),
  data       jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object'),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null default auth.uid()
);

create or replace function public.site_content_before_write()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists site_content_before_write on public.site_content;
create trigger site_content_before_write before insert or update on public.site_content
  for each row execute function public.site_content_before_write();

alter table public.site_content enable row level security;

drop policy if exists "site_content: lecture publique" on public.site_content;
create policy "site_content: lecture publique" on public.site_content
  for select to anon, authenticated using (true);

drop policy if exists "site_content: écriture par les admins" on public.site_content;
create policy "site_content: écriture par les admins" on public.site_content
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ─── Messages du formulaire de contact ─────────────────────────────
-- Le public peut seulement en déposer ; seuls les admins les lisent.
create table if not exists public.messages (
  id           uuid primary key default gen_random_uuid(),
  name         text not null check (char_length(name) between 1 and 120),
  email        text not null check (char_length(email) between 3 and 200 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone        text not null default '' check (char_length(phone) <= 40),
  organization text not null default '' check (char_length(organization) <= 160),
  subject      text not null default '' check (char_length(subject) <= 160),
  message      text not null check (char_length(message) between 1 and 5000),
  read         boolean not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists messages_created_idx on public.messages (created_at desc);

alter table public.messages enable row level security;

drop policy if exists "messages: dépôt public" on public.messages;
create policy "messages: dépôt public" on public.messages
  for insert to anon, authenticated with check (read = false);

drop policy if exists "messages: gestion par les admins" on public.messages;
create policy "messages: gestion par les admins" on public.messages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ─── Vidéos (Supabase Storage) ─────────────────────────────────────
-- Fichiers MP4/WebM envoyés depuis le dashboard, sous media/<uuid>.<ext> (50 Mo au plus).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 52428800, array['video/mp4', 'video/webm', 'video/quicktime'])
on conflict (id) do update
  set public = true, file_size_limit = 52428800, allowed_mime_types = array['video/mp4', 'video/webm', 'video/quicktime'];

drop policy if exists "media: lecture par les admins" on storage.objects;
create policy "media: lecture par les admins" on storage.objects
  for select to authenticated using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media: envoi par les admins" on storage.objects;
create policy "media: envoi par les admins" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media: modification par les admins" on storage.objects;
create policy "media: modification par les admins" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media: suppression par les admins" on storage.objects;
create policy "media: suppression par les admins" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
