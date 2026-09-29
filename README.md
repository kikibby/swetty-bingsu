# WAN HIMA BINGSU — QR Ordering System

ระบบสั่งบิงซูผ่าน QR สำหรับร้าน “หวานหิมะ บิงซู” เน้นคิวออเดอร์ในครัว และแจ้ง Telegram เฉพาะตอนมีการสั่งเมนูใหม่

## ชื่อร้าน
- ไทย: หวานหิมะ บิงซู
- English: WAN HIMA BINGSU
- Concept: Dessert Cafe / Korean-style shaved ice

## เมนู 4 รายการ
1. สตรอว์เบอร์รีบิงซู — 159 บาท
2. มะม่วงบิงซู — 159 บาท
3. มัทฉะบิงซู — 169 บาท
4. ช็อกโกแลตบิงซู — 179 บาท

## Routes
- `/` Home
- `/generate-qr` เปิดโต๊ะ / สร้าง QR
- `/order/[tableNumber]` Customer Menu
- `/customer/[tableNumber]` Customer Service
- `/customer-service` Staff Service
- `/kitchen` Kitchen
- `/dashboard` Dashboard

## API
- `/api/session/enter` ตรวจ QR Session และสร้าง HttpOnly Cookie
- `/api/sessions/open` เปิดโต๊ะ
- `/api/orders` สร้าง Order โดย Server ตรวจราคาใหม่
- `/api/customer` โหลดข้อมูล Customer
- `/api/staff-request` เรียกพนักงาน / เรียกเก็บเงิน
- `/api/staff/login` Login Staff
- `/api/staff/service` Staff Service

## Database
ใช้ Supabase PostgreSQL และมีตาราง `sessions`, `menu_categories`, `menu_items`, `orders`, `staff_requests` พร้อม Session Token, RLS, Realtime สำหรับ `orders` และ `queue_number` สำหรับคิวครัว

## รูปภาพ
Logo อยู่ที่ `public/brand/logo.png` และรูปเมนู 4 รายการอยู่ใน `public/menu/` สามารถใช้งานได้ทันทีโดยไม่ต้องพึ่ง External Image URL

## Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
STAFF_ACCESS_KEY=YOUR_STAFF_ACCESS_KEY
TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID=YOUR_TELEGRAM_CHAT_ID
```

ห้าม Upload `.env.local` ขึ้น GitHub

## Install
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Supabase
1. สร้าง Project
2. เปิด SQL Editor
3. รัน `supabase/schema.sql`
4. ตรวจ RLS และ Realtime
5. ใส่ Environment Variables

## Flow
เปิดโต๊ะ → สร้าง Session → สร้าง QR → ลูกค้าสแกน → เลือกบิงซู → Cart → ส่ง Order → ได้เลขคิว → Telegram แจ้งเฉพาะออเดอร์ใหม่ → Kitchen เรียงตามคิว → กดเสร็จ → ไปคิวถัดไป

## Security
- ไม่เปิดเผย Service Role Key ให้ Client
- ใช้ HttpOnly Session Cookie
- Server ตรวจ Session Token ทุกครั้ง
- Server ดึงราคาจาก Database เอง
- ไม่เชื่อ `price` หรือ `total` จาก Browser
- ป้องกัน Cross-table Access
- ไม่ปิด RLS เพื่อแก้ Error


## รูปเมนู
รูปเมนูทั้ง 4 รายการใช้ Supabase Storage bucket `Bingsuu` โดย `image_url` ชี้ไปยังไฟล์ใน bucket โดยตรง สามารถเปลี่ยนรูปได้ที่ Supabase Storage โดยไม่ต้องแก้โค้ดหน้าเมนู
