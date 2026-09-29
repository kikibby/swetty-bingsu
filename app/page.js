import Link from "next/link";
import { Brand, SectionIcon } from "@/components/Brand";

export default function HomePage() {
  return (
    <main className="container home-page">
      <header className="site-topbar">
        <Brand compact />
        <span className="status-chip"><span className="status-dot" /> OPEN • ORDER BY QR</span>
      </header>

      <section className="hero-card">
        <div className="hero-copy">
          <div className="eyebrow">KOREAN DESSERT CAFE • BINGSU</div>
          <h1>หวานหิมะ<br />บิงซู</h1>
          <p>บิงซูเนื้อนุ่มละมุน เสิร์ฟเย็น ๆ พร้อมผลไม้และท็อปปิ้ง<br />สั่งง่ายจากโต๊ะด้วย QR แล้วรอรับความหวานได้เลย</p>
          <div className="hero-actions">
            <Link href="/order/20" className="hero-primary"><SectionIcon type="menu" /> ดูเมนูบิงซู</Link>
            <Link href="/generate-qr" className="hero-secondary"><SectionIcon type="qr" /> สร้าง QR โต๊ะ</Link>
          </div>
        </div>
        <div className="hero-brand-art"><Brand /></div>
      </section>

      <section className="flow-card">
        <div className="flow-heading">
          <div className="eyebrow">HOW TO ENJOY</div>
          <h2>สั่งบิงซูง่าย ๆ จากโต๊ะของคุณ</h2>
        </div>
        <div className="flow-steps">
          <span><small>01</small>เปิดโต๊ะ</span><b>→</b>
          <span><small>02</small>สแกน QR</span><b>→</b>
          <span><small>03</small>เลือกบิงซู</span><b>→</b>
          <span><small>04</small>ส่งออเดอร์</span><b>→</b>
          <span><small>05</small>รับความหวาน</span>
        </div>
      </section>

      <section className="feature-grid">
        <Link href="/generate-qr" className="feature-card feature-red">
          <div className="feature-icon"><SectionIcon type="table" /></div>
          <div><h2>จัดการโต๊ะ</h2><p>เปิดโต๊ะและสร้าง QR สำหรับลูกค้า</p></div>
        </Link>
        <Link href="/kitchen" className="feature-card feature-blue">
          <div className="feature-icon"><SectionIcon type="kitchen" /></div>
          <div><h2>จอครัว</h2><p>ดูคิวบิงซูและอัปเดตสถานะแบบเรียลไทม์</p></div>
        </Link>
        <Link href="/dashboard" className="feature-card feature-gold">
          <div className="feature-icon"><SectionIcon type="dashboard" /></div>
          <div><h2>Dashboard</h2><p>ดูยอดขาย ออเดอร์ และโต๊ะที่ใช้งาน</p></div>
        </Link>
      </section>
    </main>
  );
}
