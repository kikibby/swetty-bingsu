"use client";
import { useState } from "react";
import QRCode from "qrcode";
import { Brand } from "@/components/Brand";

export default function GenerateQRPage() {
  const [tableNumber, setTableNumber] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [qrUrl, setQrUrl] = useState("");
  const [orderUrl, setOrderUrl] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loading, setLoading] = useState(false);

  async function openTable() {
    const table = tableNumber.trim();
    const adultCount = Math.max(0, Number(adults) || 0);
    const childCount = Math.max(0, Number(children) || 0);
    if (!table) return (setMessage("กรุณากรอกหมายเลขโต๊ะ"), setMessageType("error"));
    if (adultCount + childCount < 1) return (setMessage("กรุณาระบุจำนวนลูกค้าอย่างน้อย 1 คน"), setMessageType("error"));
    setLoading(true); setMessage("");
    try {
      const response = await fetch("/api/sessions/open", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tableNumber: table, adultCount, childCount }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "เปิดโต๊ะไม่สำเร็จ");
      const session = result.session;
      const url = `${window.location.origin}/order/${encodeURIComponent(table)}?token=${encodeURIComponent(session.token)}`;
      setOrderUrl(url); setQrUrl(await QRCode.toDataURL(url, { width: 560, margin: 1, color: { dark: "#17201d", light: "#fffaf0" } }));
      setMessage(result.reused ? "ใช้ QR ของโต๊ะนี้ที่เปิดอยู่แล้ว" : "เปิดโต๊ะเรียบร้อย"); setMessageType("success");
    } catch (error) { setMessage(error.message || "เกิดข้อผิดพลาด"); setMessageType("error"); }
    finally { setLoading(false); }
  }

  return <main className="container qr-studio-page">
    <header className="qr-studio-nav"><Brand compact /><span>TABLE STUDIO</span><small>01 / 01</small></header>
    <section className="qr-studio-layout">
      <div className="qr-studio-form"><span className="studio-kicker">SET THE TABLE</span><h1>สร้างทางเข้า<br /><em>ให้โต๊ะของคุณ</em></h1><p>กรอกข้อมูลสั้น ๆ แล้วสร้าง QR สำหรับลูกค้าสแกนเข้าหน้าเมนู</p>
        <label>หมายเลขโต๊ะ<input value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} placeholder="01" /></label>
        <div className="studio-split"><label>ผู้ใหญ่<input type="number" min="0" value={adults} onChange={(e) => setAdults(e.target.value)} /></label><label>เด็ก<input type="number" min="0" value={children} onChange={(e) => setChildren(e.target.value)} /></label></div>
        <button className="studio-submit" onClick={openTable} disabled={loading}>{loading ? "กำลังสร้าง..." : "สร้าง QR →"}</button>
        {message && <p className={`studio-message ${messageType}`}>{message}</p>}
      </div>
      <div className="qr-studio-preview">{qrUrl ? <><div className="qr-paper"><img src={qrUrl} alt={`QR โต๊ะ ${tableNumber}`} /><span>SCAN FOR BINGSU</span></div><h2>TABLE {tableNumber}</h2><p>สแกนเพื่อเปิดเมนูและสั่งจากโต๊ะ</p><div className="qr-direct-link"><div className="qr-direct-link-title">🔗 ลิงก์หน้าสั่งอาหาร</div><a className="qr-direct-link-url" href={orderUrl} target="_blank" rel="noreferrer">{orderUrl}</a><button type="button" className="qr-copy-button" onClick={async () => { try { await navigator.clipboard.writeText(orderUrl); setMessage("คัดลอกลิงก์แล้ว"); setMessageType("success"); } catch { setMessage("คัดลอกลิงก์ไม่สำเร็จ"); setMessageType("error"); } }}>📋 คัดลอกลิงก์</button></div></> : <div className="qr-empty"><span>QR</span><h2>รอการสร้าง</h2><p>QR ของโต๊ะจะอยู่ตรงนี้</p></div>}</div>
    </section>
  </main>;
}
