create extension if not exists pgcrypto;

create sequence if not exists public.order_queue_seq;

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  table_number text not null,
  adult_count integer not null default 1 check (adult_count >= 0),
  child_count integer not null default 0 check (child_count >= 0),
  status text not null default 'open' check (status in ('open','closed')),
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  token text
);

alter table public.sessions add column if not exists token text;
update public.sessions set token = encode(gen_random_bytes(32), 'hex') where token is null;
create unique index if not exists idx_sessions_token_unique on public.sessions(token) where token is not null;
alter table public.sessions alter column token set default encode(gen_random_bytes(32), 'hex');
alter table public.sessions add column if not exists adult_count integer not null default 1;
alter table public.sessions add column if not exists child_count integer not null default 0;

create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order integer not null default 0
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.menu_categories(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  image_url text,
  is_available boolean not null default true
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  table_number text not null,
  queue_number bigint not null default nextval('public.order_queue_seq'),
  items jsonb not null default '[]'::jsonb,
  total numeric(10,2) not null default 0,
  status text not null default 'received' check (status in ('received','preparing','ready','served')),
  created_at timestamptz not null default now()
);

create table if not exists public.staff_requests (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  type text not null check (type in ('staff','bill')),
  status text not null default 'pending' check (status in ('pending','handled','cancelled')),
  created_at timestamptz not null default now(),
  handled_at timestamptz
);

create index if not exists idx_staff_requests_session_id on public.staff_requests(session_id);
create index if not exists idx_staff_requests_status on public.staff_requests(status);
create unique index if not exists idx_staff_requests_pending_unique on public.staff_requests(session_id,type) where status='pending';
create index if not exists idx_sessions_table_number on public.sessions(table_number);
create index if not exists idx_sessions_status on public.sessions(status);
create index if not exists idx_menu_items_category_id on public.menu_items(category_id);
create index if not exists idx_orders_session_id on public.orders(session_id);
create index if not exists idx_orders_queue_number on public.orders(queue_number);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at);

insert into public.menu_categories (name, sort_order)
select 'บิงซูนมสด', 1 where not exists (select 1 from public.menu_categories where name='บิงซูนมสด');
insert into public.menu_categories (name, sort_order)
select 'ชา & ช็อกโกแลต', 2 where not exists (select 1 from public.menu_categories where name='ชา & ช็อกโกแลต');
insert into public.menu_categories (name, sort_order)
select 'ผลไม้สด', 3 where not exists (select 1 from public.menu_categories where name='ผลไม้สด');

insert into public.menu_items (category_id,name,description,price,image_url)
select c.id,'สตรอว์เบอร์รีบิงซู','นมสดเกล็ดหิมะ ท็อปด้วยสตรอว์เบอร์รีสด',159,'https://upbhorzhiliejmqagchm.supabase.co/storage/v1/object/public/Bingsuu/strawberry-bingsu.png.jpg'
from public.menu_categories c where c.name='บิงซูนมสด' and not exists (select 1 from public.menu_items where name='สตรอว์เบอร์รีบิงซู');
insert into public.menu_items select gen_random_uuid(),c.id,'มะม่วงบิงซู','มะม่วงหวานฉ่ำพร้อมซอสมะม่วง',159,'https://upbhorzhiliejmqagchm.supabase.co/storage/v1/object/public/Bingsuu/mango-bingsu.png.jpg',true from public.menu_categories c where c.name='ผลไม้สด' and not exists (select 1 from public.menu_items where name='มะม่วงบิงซู');
insert into public.menu_items select gen_random_uuid(),c.id,'มัทฉะบิงซู','ชาเขียวมัทฉะเข้มข้น พร้อมถั่วแดง',169,'https://upbhorzhiliejmqagchm.supabase.co/storage/v1/object/public/Bingsuu/matcha-bingsu.png.jpg',true from public.menu_categories c where c.name='ชา & ช็อกโกแลต' and not exists (select 1 from public.menu_items where name='มัทฉะบิงซู');
insert into public.menu_items select gen_random_uuid(),c.id,'ช็อกโกแลตบิงซู','ช็อกโกแลตเข้มข้น บราวนี และคุกกี้',179,'https://upbhorzhiliejmqagchm.supabase.co/storage/v1/object/public/Bingsuu/choco-bingsu.png.jpg',true from public.menu_categories c where c.name='ชา & ช็อกโกแลต' and not exists (select 1 from public.menu_items where name='ช็อกโกแลตบิงซู');

-- Enable Realtime for orders once in Supabase if it is not already enabled.
