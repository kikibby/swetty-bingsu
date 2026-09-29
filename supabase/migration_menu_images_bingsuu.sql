-- WAN HIMA BINGSU: use Supabase Storage bucket Bingsuu for all 4 menu images

update public.menu_items set image_url = 'https://upbhorzhiliejmqagchm.supabase.co/storage/v1/object/public/Bingsuu/strawberry-bingsu.png.jpg' where name = 'สตรอว์เบอร์รีบิงซู';
update public.menu_items set image_url = 'https://upbhorzhiliejmqagchm.supabase.co/storage/v1/object/public/Bingsuu/mango-bingsu.png.jpg' where name = 'มะม่วงบิงซู';
update public.menu_items set image_url = 'https://upbhorzhiliejmqagchm.supabase.co/storage/v1/object/public/Bingsuu/matcha-bingsu.png.jpg' where name = 'มัทฉะบิงซู';
update public.menu_items set image_url = 'https://upbhorzhiliejmqagchm.supabase.co/storage/v1/object/public/Bingsuu/choco-bingsu.png.jpg' where name = 'ช็อกโกแลตบิงซู';

select name, price, image_url from public.menu_items where is_available = true order by name;
