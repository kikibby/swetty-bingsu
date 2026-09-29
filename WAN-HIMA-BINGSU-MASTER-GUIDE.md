# WAN HIMA BINGSU — MASTER GUIDE

## PART 1 — แนวคิดร้าน
ร้านชื่อ **หวานหิมะ บิงซู (WAN HIMA BINGSU)** เป็น Dessert Cafe สำหรับสั่งบิงซูผ่าน QR ประจำโต๊ะ ระบบใช้ Next.js + Supabase + Realtime + Telegram + Vercel โดย Telegram แจ้งเฉพาะออเดอร์ใหม่

## PART 2 — เมนู 4 รายการ
1. สตรอว์เบอร์รีบิงซู — 159 บาท
2. มะม่วงบิงซู — 159 บาท
3. มัทฉะบิงซู — 169 บาท
4. ช็อกโกแลตบิงซู — 179 บาท

## PART 3 — Routes
`/` Home, `/generate-qr`, `/order/[tableNumber]`, `/customer/[tableNumber]`, `/customer-service`, `/kitchen`, `/dashboard`

## PART 4 — Database
ตารางหลัก: `sessions`, `menu_categories`, `menu_items`, `orders`, `staff_requests` โดยมี Session Token, `closed_at`, `orders.session_id`, Staff Request และ Unique Pending Request

## PART 5 — Customer Flow
เปิดโต๊ะ → สร้าง Session → สร้าง QR → ลูกค้าสแกน → ตรวจ Token → Cookie → เลือกบิงซู → Cart → ส่ง Order → Server ตรวจราคา → ได้เลขคิว → Telegram แจ้งออเดอร์ → Kitchen Realtime → Preparing → Ready → Served → คิวถัดไป

## PART 6 — Customer Service
ลูกค้าดูออเดอร์ เรียกพนักงาน และเรียกเก็บเงินได้จาก Session ของโต๊ะตัวเองเท่านั้น

## PART 7 — Queue
ทุกออเดอร์จะได้รับ `queue_number` จาก PostgreSQL Sequence เพื่อให้คิวไม่ชนกัน เมื่อออเดอร์ก่อนหน้าถูกกดเสร็จ จอครัวจะแสดงคิวที่ยังค้างถัดไปตามลำดับ

## PART 8 — Security
ใช้ RLS, Session Token, HttpOnly Cookie และ Server-side Validation ห้ามเชื่อ `price`, `total` หรือ `session_id` จาก Browser และห้ามเปิด Service Role ให้ Client

## PART 9 — Telegram
ตั้ง `TELEGRAM_BOT_TOKEN` และ `TELEGRAM_CHAT_ID` ระบบจะส่ง Telegram เฉพาะเมื่อมีการสร้างออเดอร์ใหม่ โดยข้อความระบุเลขคิว โต๊ะ รายการ และยอดรวม ไม่ส่งแจ้งเตือนการเรียกพนักงานหรือเรียกเก็บเงิน

## PART 10 — Storage / Images
Logo อยู่ที่ `public/brand/logo.png` และเมนูอยู่ที่ `public/menu/*.png` จำนวน 4 รูป ไม่ต้องพึ่ง URL ภายนอก

## PART 11 — GitHub / Vercel
สร้าง Repository ใหม่ → `git add .` → `git commit` → `git push` → Import เข้า Vercel → ตั้ง Environment Variables → Deploy → ทดสอบ Production

## PART 12 — Checklist
- [ ] Supabase schema
- [ ] RLS
- [ ] Realtime orders
- [ ] Storage/รูปเมนู
- [ ] Session Token
- [ ] Customer Menu
- [ ] Kitchen
- [ ] Customer Service
- [ ] Staff Request
- [ ] Billing + VAT 7%
- [ ] Telegram เฉพาะออเดอร์ใหม่
- [ ] Queue Number
- [ ] GitHub
- [ ] Vercel
- [ ] Production Test
