-- WAN HIMA BINGSU: repair the four active menu records and image URLs.
-- Run once only if the menu table is empty or the four items are missing.

insert into public.menu_categories (name, sort_order)
select 'บิงซูนมสด', 1
where not exists (select 1 from public.menu_categories where name = 'บิงซูนมสด');

insert into public.menu_categories (name, sort_order)
select 'ชา & ช็อกโกแลต', 2
where not exists (select 1 from public.menu_categories where name = 'ชา & ช็อกโกแลต');

insert into public.menu_categories (name, sort_order)
select 'ผลไม้สด', 3
where not exists (select 1 from public.menu_categories where name = 'ผลไม้สด');

insert into public.menu_items (category_id, name, description, price, image_url, is_available)
select c.id, 'สตรอว์เบอร์รีบิงซู', 'นมสดเกล็ดหิมะ ท็อปด้วยสตรอว์เบอร์รีสด', 159,
  'https://qyfbgupjvdvkqyrlcgsz.supabase.co/storage/v1/object/public/Bingsuu/strawberry-bingsu.png.jpg', true
from public.menu_categories c
where c.name = 'บิงซูนมสด'
  and not exists (select 1 from public.menu_items where name = 'สตรอว์เบอร์รีบิงซู');

insert into public.menu_items (category_id, name, description, price, image_url, is_available)
select c.id, 'มะม่วงบิงซู', 'มะม่วงหวานฉ่ำพร้อมซอสมะม่วง', 159,
  'https://qyfbgupjvdvkqyrlcgsz.supabase.co/storage/v1/object/public/Bingsuu/mango-bingsu.png.jpg', true
from public.menu_categories c
where c.name = 'ผลไม้สด'
  and not exists (select 1 from public.menu_items where name = 'มะม่วงบิงซู');

insert into public.menu_items (category_id, name, description, price, image_url, is_available)
select c.id, 'มัทฉะบิงซู', 'ชาเขียวมัทฉะเข้มข้น พร้อมถั่วแดง', 169,
  'https://qyfbgupjvdvkqyrlcgsz.supabase.co/storage/v1/object/public/Bingsuu/matcha-bingsu.png.jpg', true
from public.menu_categories c
where c.name = 'ชา & ช็อกโกแลต'
  and not exists (select 1 from public.menu_items where name = 'มัทฉะบิงซู');

insert into public.menu_items (category_id, name, description, price, image_url, is_available)
select c.id, 'ช็อกโกแลตบิงซู', 'ช็อกโกแลตเข้มข้น บราวนี และคุกกี้', 179,
  'https://qyfbgupjvdvkqyrlcgsz.supabase.co/storage/v1/object/public/Bingsuu/choco-bingsu.png.jpg', true
from public.menu_categories c
where c.name = 'ชา & ช็อกโกแลต'
  and not exists (select 1 from public.menu_items where name = 'ช็อกโกแลตบิงซู');

update public.menu_items set is_available = true
where name in ('สตรอว์เบอร์รีบิงซู','มะม่วงบิงซู','มัทฉะบิงซู','ช็อกโกแลตบิงซู');

update public.menu_items set is_available = false
where name in ('โอรีโอบิงซู','เมลอนบิงซู','ชาไทยบิงซู','มะพร้าวอ่อนบิงซู','ถั่วแดงนมสดบิงซู','ฟรุตรวมบิงซู');

select name, price, image_url
from public.menu_items
where is_available = true
order by name;
