"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Brand } from "@/components/Brand";

const statusMap = {
  received: ["รอครัว", "status-wait"],
  preparing: ["กำลังทำ", "status-making"],
  ready: ["พร้อมเสิร์ฟ", "status-ready"],
  served: ["เสิร์ฟแล้ว", "status-done"],
};

export default function CustomerPage() {
  const params = useParams();
  const tableNumber = decodeURIComponent(params.tableNumber);
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadCustomer() {
    try {
      const res = await fetch("/api/customer", { cache: "no-store" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "โหลดข้อมูลไม่ได้");
      setData(result);
      setMessage("");
    } catch (e) { setMessage(e.message || "เกิดข้อผิดพลาด"); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    loadCustomer();
    const timer = setInterval(loadCustomer, 4000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return <main className="container receipt-page loading-page"><Brand compact /><p>กำลังเตรียมใบออเดอร์...</p></main>;
  if (!data) return <main className="container receipt-page"><div className="receipt-error"><Brand compact /><h1>โต๊ะ {tableNumber}</h1><p>{message || "ไม่พบ Session"}</p></div></main>;

  const subtotal = (data.orders || []).reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <main className="container receipt-page">
      <header className="receipt-head"><Brand compact /><div><span>ORDER CHECK</span><strong>TABLE {data.session.table_number}</strong></div></header>
      <section className="receipt-intro"><div className="receipt-number">{String(data.orders.length).padStart(2, "0")}</div><div><span>รายการของคุณ</span><h1>กำลังเดินทางสู่โต๊ะ</h1><p>หน้านี้จะอัปเดตสถานะออเดอร์อัตโนมัติ</p></div></section>
      <section className="receipt-paper">
        <div className="receipt-paper-head"><span>QUEUE / ITEMS</span><span>STATUS</span></div>
        {!data.orders.length ? <div className="receipt-empty">ยังไม่มีออเดอร์<br /><small>กลับไปหน้าเมนูเพื่อสั่งบิงซูได้เลย</small></div> : data.orders.map((order) => {
          const [label, cls] = statusMap[order.status] || statusMap.received;
          return <article className="receipt-order" key={order.id}>
            <div className="receipt-order-main"><div className="queue-number">#{order.queue_number}</div><div><h2>ออเดอร์สำหรับโต๊ะ {order.table_number}</h2>{order.items.map((item, i) => <p key={i}>{item.name} × {item.quantity}</p>)}</div></div>
            <div className={`receipt-status ${cls}`}>{label}</div>
            <div className="receipt-order-total">{Number(order.total).toLocaleString("th-TH", { minimumFractionDigits: 2 })} บาท</div>
          </article>;
        })}
        <div className="receipt-total"><span>ยอดรวมออเดอร์</span><strong>{subtotal.toLocaleString("th-TH", { minimumFractionDigits: 2 })} บาท</strong></div>
      </section>
      <p className="receipt-note">โต๊ะ {data.session.table_number} • ผู้ใหญ่ {data.session.adult_count} • เด็ก {data.session.child_count}</p>
      {message && <p className="notice error">{message}</p>}
    </main>
  );
}
