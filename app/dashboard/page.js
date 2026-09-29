"use client";
import { useEffect,useState } from "react";
import { Brand } from "@/components/Brand";
export default function DashboardPage(){
 const [orders,setOrders]=useState([]),[sessions,setSessions]=useState([]),[loading,setLoading]=useState(true),[message,setMessage]=useState("");
 useEffect(()=>{load();},[]);
 async function load(){setLoading(true);const start=new Date();start.setHours(0,0,0,0);const [o,s]=await Promise.all([fetch(`/api/dashboard?start=${encodeURIComponent(start.toISOString())}`,{cache:"no-store"}),fetch(`/api/dashboard?kind=sessions`,{cache:"no-store"})]); if(!o.ok||!s.ok){setMessage("ยังโหลดข้อมูลสรุปไม่ได้");setLoading(false);return;}const od=await o.json(),sd=await s.json();setOrders(od.orders||[]);setSessions(sd.sessions||[]);setLoading(false)}
 if(loading)return <main className="container dashboard-paper loading-page"><Brand compact/><p>กำลังจัดหน้าร้านวันนี้...</p></main>;
 const sales=orders.reduce((sum,o)=>sum+Number(o.total||0),0),active=sessions.filter(s=>s.status==="open").length,served=orders.filter(o=>o.status==="served").length,items=orders.reduce((n,o)=>n+(o.items||[]).reduce((x,i)=>x+Number(i.quantity||0),0),0);
 return <main className="container dashboard-paper"><header className="dash-head"><Brand compact/><div><span>WAN HIMA / DAILY LEDGER</span><h1>ภาพรวมร้าน</h1></div><div className="dash-date">TODAY</div></header>{message&&<p className="notice error">{message}</p>}
 <section className="dash-metrics"><div className="metric large"><span>ยอดออเดอร์</span><strong>{sales.toLocaleString()} ฿</strong><small>จาก {orders.length} ออเดอร์</small></div><div className="metric"><span>โต๊ะเปิด</span><strong>{active}</strong><small>โต๊ะ</small></div><div className="metric"><span>เสิร์ฟแล้ว</span><strong>{served}</strong><small>ออเดอร์</small></div><div className="metric"><span>จำนวนชิ้น</span><strong>{items}</strong><small>รายการ</small></div></section>
 <section className="dash-board"><div className="dash-board-title"><span>RECENT ORDERS</span><strong>คิวล่าสุด</strong></div>{orders.slice(-8).reverse().map(o=><div className="dash-row" key={o.id}><b>#{o.queue_number}</b><span>โต๊ะ {o.table_number}</span><span>{(o.items||[]).map(i=>`${i.name} ×${i.quantity}`).join(", ")}</span><strong>{Number(o.total).toLocaleString()} ฿</strong></div>)}{!orders.length&&<div className="dash-empty">วันนี้ยังไม่มีออเดอร์</div>}</section>
 </main>;
}
