-- WAN HIMA BINGSU: queue numbers + Telegram only for new orders
-- Run this after the existing schema if the database already exists.

create sequence if not exists public.order_queue_seq;

alter table public.orders
  add column if not exists queue_number bigint;

-- Backfill queue numbers for existing orders in creation order.
with numbered as (
  select id, row_number() over (order by created_at, id) as rn
  from public.orders
  where queue_number is null
)
update public.orders o
set queue_number = numbered.rn
from numbered
where o.id = numbered.id;

-- Continue the sequence after the largest assigned queue number.
do $$
declare
  max_queue bigint;
begin
  select max(queue_number) into max_queue from public.orders;
  if max_queue is null or max_queue < 1 then
    perform setval('public.order_queue_seq', 1, false);
  else
    perform setval('public.order_queue_seq', max_queue, true);
  end if;
end $$;

alter table public.orders
  alter column queue_number set default nextval('public.order_queue_seq');

alter table public.orders
  alter column queue_number set not null;

create index if not exists idx_orders_queue_number on public.orders(queue_number);

-- Telegram behavior is application-side: only POST /api/orders sends a Telegram message.
