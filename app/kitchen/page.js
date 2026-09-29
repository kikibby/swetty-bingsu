"use client";
import { useEffect, useState } from "react";
import { Brand } from "@/components/Brand";
const columns=[
 {status:"received",title:"INBOX",sub:"รับออเดอร์",next:"preparing",action:"เริ่มทำ",tone:"violet"},
 {status:"preparing",title:"MAKING",sub:"กำลังทำ",next:"ready",action:"เสร็จแล้ว",tone:"blue"},
 {status:"ready",title:"PASS",sub:"พร้อมเสิร์ฟ",next:"served",action:"ปิดคิว",tone:"green"},
];
export default function KitchenPage(){
 const [orders,setOrders]=useState([]),[message,setMessage]=useState("");
 useEffect(()=>{loadOrders();const timer=setInterval(loadOrders,3000);return()=>clearInterval(timer)},[]);
 async function loadOrders(){try{const res=await fetch("/api/kitchen",{cache:"no-store"});const result=await res.json();if(!res.ok)throw new Error(result.message||"โหลดคิวไม่ได้");setOrders(result.orders||[]);setMessage("")}catch(error){setMessage(error.message||"โหลดคิวไม่ได้")}}
 async function updateStatus(id,status){try{const res=await fetch("/api/kitchen",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,status})});const result=await res.json();if(!res.ok)throw new Error(result.message||"เปลี่ยนสถานะไม่ได้");await loadOrders()}catch(error){setMessage(error.message||"เปลี่ยนสถานะไม่ได้")}}
 const next=orders[0];
 return <main className="container kitchen-board"><header className="kitchen-nav"><Brand compact/><div><span>KITCHEN / QUEUE CONTROL</span><small>สด • อัปเดตอัตโนมัติ</small></div><div className="kitchen-clock">{orders.length}<small>คิวค้าง</small></div></header>
 <section className="kitchen-hero"><div><span>NEXT IN LINE</span><strong>{next?`#${next.queue_number}`:"—"}</strong><p>{next?`โต๊ะ ${next.table_number} • ทำตามลำดับคิว`:"ยังไม่มีออเดอร์ที่รอ"}</p></div><div className="queue-wave"/></section>
 {message&&<p className="notice error">{message}</p>}
 <section className="kitchen-columns">{columns.map(col=>{const rows=orders.filter(o=>o.status===col.status);return <div className={`kitchen-lane ${col.tone}`} key={col.status}><div className="lane-title"><div><span>{col.title}</span><h2>{col.sub}</h2></div><b>{rows.length}</b></div>{rows.map(order=><article className="kitchen-ticket" key={order.id}><div className="ticket-top"><strong>#{order.queue_number}</strong><span>โต๊ะ {order.table_number}</span></div><div className="ticket-items">{(order.items||[]).map((item,i)=><div key={i}><span>{item.name}</span><b>×{item.quantity}</b></div>)}</div><div className="ticket-bottom"><strong>{Number(order.total).toLocaleString()} ฿</strong><button onClick={()=>updateStatus(order.id,col.next)}>{col.action} →</button></div></article>)}</div>})}</section>
 </main>;
}
