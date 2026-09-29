-- WAN HIMA BINGSU: keep only the first 4 menu items available
-- Safe for existing databases: old menu items are hidden, not deleted.
update public.menu_items
set is_available = false
where name in (
  'โอรีโอบิงซู',
  'เมลอนบิงซู',
  'ชาไทยบิงซู',
  'มะพร้าวอ่อนบิงซู',
  'ถั่วแดงนมสดบิงซู',
  'ฟรุตรวมบิงซู'
);

-- Verify the currently available menu count.
select name, price, image_url
from public.menu_items
where is_available = true
order by name;
