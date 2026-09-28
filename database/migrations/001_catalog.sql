-- NHA Medical catalogue. Run once on a new Supabase project; no demo products.
-- Existing legacy tables require an explicit reviewed migration, never DROP them.
begin;
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

create table public.catalog_admins (
 user_id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
alter table public.catalog_admins enable row level security;
revoke all on public.catalog_admins from anon, authenticated;
grant select on public.catalog_admins to authenticated;
create policy admin_read_self on public.catalog_admins for select to authenticated using (user_id = (select auth.uid()));
create function private.is_catalog_admin() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.catalog_admins where user_id = (select auth.uid()));
$$;
revoke all on function private.is_catalog_admin() from public;
grant execute on function private.is_catalog_admin() to anon, authenticated;

create function private.valid_asset_url(value text) returns boolean language sql immutable set search_path = '' as $$
 select value = '' or (length(value) <= 2048 and value !~ '[[:space:]\\]' and
 ((value ~ '^/[^/][a-zA-Z0-9/_.%\-]*$' and value !~ '\.\.' and value !~* '%(2f|5c|2e|00)')
 or value ~ '^https://[a-zA-Z0-9][a-zA-Z0-9.\-]*(:[0-9]+)?([/?#][^@]*)?$'));
$$;
create function private.valid_catalog_array(value jsonb, kind text) returns boolean language plpgsql immutable set search_path = '' as $$
declare item jsonb; max_items int;
begin
 if jsonb_typeof(value) <> 'array' then return false; end if;
 max_items := case kind when 'specifications' then 200 when 'application_items' then 100 else 50 end;
 if jsonb_array_length(value) > max_items then return false; end if;
 for item in select * from jsonb_array_elements(value) loop
  if kind = 'application_items' then
   if jsonb_typeof(item) <> 'string' or length(btrim(item #>> '{}')) not between 1 and 2000 then return false; end if;
  else
   if jsonb_typeof(item) <> 'object' then return false; end if;
   if kind = 'specifications' then
    if not (item ?& array['name','value','unit','group']) or
      jsonb_typeof(item->'name') <> 'string' or jsonb_typeof(item->'value') <> 'string' or
      jsonb_typeof(item->'unit') <> 'string' or jsonb_typeof(item->'group') <> 'string' or
      length(btrim(item->>'name')) not between 1 and 200 or length(btrim(item->>'value')) not between 1 and 2000 or
      length(item->>'unit') > 80 or length(item->>'group') > 200 then return false; end if;
   elsif kind = 'documents' then
    if not (item ?& array['name','href']) or jsonb_typeof(item->'name') <> 'string' or jsonb_typeof(item->'href') <> 'string' or
      length(btrim(item->>'name')) not between 1 and 200 or item->>'href' = '' or not private.valid_asset_url(item->>'href') then return false; end if;
   elsif kind = 'media' then
    if not (item ?& array['type','src']) or jsonb_typeof(item->'src') <> 'string' or
      item->>'src' = '' or not private.valid_asset_url(item->>'src') then return false; end if;
    if item->>'type' = 'image' then
     if not (item ? 'alt') or jsonb_typeof(item->'alt') <> 'string' or length(btrim(item->>'alt')) not between 1 and 300 then return false; end if;
    elsif item->>'type' = 'video' then
     if not (item ? 'title') or jsonb_typeof(item->'title') <> 'string' or length(btrim(item->>'title')) not between 1 and 300 then return false; end if;
     if item ? 'poster' and (jsonb_typeof(item->'poster') <> 'string' or not private.valid_asset_url(item->>'poster')) then return false; end if;
    else return false; end if;
   else return false; end if;
  end if;
 end loop;
 return true;
end;
$$;
create table public.categories (
 id uuid primary key default gen_random_uuid(),
 name text not null check(length(btrim(name)) between 1 and 200),
 slug text unique not null check(length(slug) <= 160 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 description text not null default '' check(length(description) <= 1000),
 icon text not null default 'Package' check(icon in ('Microscope','Package','HeartPulse','TestTubes','FlaskConical','ShieldCheck')),
 sort_order integer not null default 0 check(sort_order between 0 and 99999),
 active boolean not null default false,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.products (
 id uuid primary key default gen_random_uuid(),
 category_id uuid not null references public.categories(id) on delete restrict,
 name text not null check(length(btrim(name)) between 1 and 200),
 slug text unique not null check(length(slug) <= 160 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 sku text unique not null check(length(sku) <= 80 and sku ~ '^[A-Z0-9][A-Z0-9._-]*$'),
 model text not null default '' check(length(model) <= 200),
 brand text not null default '' check(length(brand) <= 200),
 description text not null default '' check(length(description) <= 1000),
 image text not null default '' check(private.valid_asset_url(image)),
 media jsonb not null default '[]' check(private.valid_catalog_array(media,'media')),
 documents jsonb not null default '[]' check(private.valid_catalog_array(documents,'documents')),
 introduction text not null default '' check(length(introduction) <= 20000),
 applications text not null default '' check(length(applications) <= 20000),
 application_items jsonb not null default '[]' check(private.valid_catalog_array(application_items,'application_items')),
 specifications jsonb not null default '[]' check(private.valid_catalog_array(specifications,'specifications')),
 status text not null default 'draft' check(status in ('draft','published')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index products_category_status_idx on public.products(category_id,status);
create index categories_display_idx on public.categories(active,sort_order,name);
create function private.catalog_timestamps() returns trigger language plpgsql set search_path = '' as $$
begin
 if TG_OP = 'UPDATE' then NEW.id := OLD.id; NEW.created_at := OLD.created_at;
 else NEW.created_at := clock_timestamp(); end if;
 NEW.updated_at := clock_timestamp(); return NEW;
end;
$$;
create trigger categories_timestamps before insert or update on public.categories for each row execute function private.catalog_timestamps();
create trigger products_timestamps before insert or update on public.products for each row execute function private.catalog_timestamps();
alter table public.categories enable row level security;
alter table public.products enable row level security;
revoke all on public.categories, public.products from anon, authenticated;
grant select on public.categories, public.products to anon, authenticated;
grant insert, update, delete on public.categories, public.products to authenticated;
create policy categories_public on public.categories for select to anon, authenticated using (active);
create policy categories_admin on public.categories for all to authenticated using ((select private.is_catalog_admin())) with check ((select private.is_catalog_admin()));
create policy products_public on public.products for select to anon, authenticated using
 (status = 'published' and exists(select 1 from public.categories c where c.id = category_id and c.active));
create policy products_admin on public.products for all to authenticated using ((select private.is_catalog_admin())) with check ((select private.is_catalog_admin()));
revoke all on function private.valid_asset_url(text), private.valid_catalog_array(jsonb,text), private.catalog_timestamps() from public;
grant execute on function private.valid_asset_url(text), private.valid_catalog_array(jsonb,text) to anon, authenticated;
commit;
