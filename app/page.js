import Link from "next/link";
import { Brand } from "@/components/Brand";

export default function HomePage() {
  return (
    <main className="container landing-page">
      <header className="landing-nav"><Brand compact /><div className="nav-note">DESSERT • SINCE TODAY</div><Link href="/generate-qr" className="nav-link">เปิดโต๊ะ</Link></header>
      <section className="landing-stage">
        <div className="landing-copy"><span className="landing-label">WAN HIMA BINGSU / 01</span><h1>ความเย็น<br /><i>ที่กินแล้ว</i><br />ยิ้มได้</h1><p>บิงซูนมสดเนื้อนุ่ม รสชาติชัด และท็อปปิ้งที่ออกแบบมาให้แบ่งกันได้ทั้งโต๊ะ</p><div className="landing-buttons"><Link href="/generate-qr" className="landing-primary">เริ่มใช้งานโต๊ะ</Link><Link href="/kitchen" className="landing-text-link">ไปจอครัว →</Link></div></div>
        <div className="landing-art"><div className="art-circle art-one"/><div className="art-circle art-two"/><div className="art-card"><Brand /><span>SNOWY • SOFT • SWEET</span></div></div>
      </section>
      <section className="landing-strip"><div><b>01</b><span>เปิดโต๊ะ</span></div><div><b>02</b><span>สร้าง QR</span></div><div><b>03</b><span>ลูกค้าสั่ง</span></div><div><b>04</b><span>ครัวทำตามคิว</span></div></section>
    </main>
  );
}
