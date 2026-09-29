"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Brand, SectionIcon } from "@/components/Brand";

export default function OrderPage() {
  const params = useParams();
  const tableNumber = decodeURIComponent(params.tableNumber);
  const [session, setSession] = useState(null);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => { enterAndLoad(); }, [tableNumber]);

  async function enterAndLoad() {
    setLoading(true);
    try {
      const token = new URLSearchParams(window.location.search).get("token");
      if (!token) throw new Error("QR นี้ไม่มี Session Token กรุณาสแกน QR จากโต๊ะใหม่");

      const enterResponse = await fetch("/api/session/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNumber, token }),
      });
      const entered = await enterResponse.json();
      if (!enterResponse.ok) throw new Error(entered.message || "QR หมดอายุ");

      const menuResponse = await fetch("/api/menu", { cache: "no-store" });
      const menuResult = await menuResponse.json();
      if (!menuResponse.ok) throw new Error(menuResult.message || "โหลดเมนูไม่สำเร็จ");

      setSession(entered.session);
      setCategories(menuResult.categories || []);
      setMenuItems(menuResult.items || []);
    } catch (error) {
      setMessage(error.message || "โหลดข้อมูลไม่ได้");
    } finally { setLoading(false); }
  }

  function getQuantity(id) { return cart.find((item) => item.id === id)?.quantity || 0; }

  function changeQuantity(item, delta) {
    setCart((current) => {
      const found = current.find((x) => x.id === item.id);
      if (!found && delta > 0) return [...current, { id: item.id, name: item.name, price: Number(item.price), quantity: 1 }];
      return current.map((x) => x.id === item.id ? { ...x, quantity: x.quantity + delta } : x).filter((x) => x.quantity > 0);
    });
  }

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const itemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  async function submitOrder() {
    if (!session) return setMessage("ไม่พบ Session ของโต๊ะนี้");
    if (!cart.length) return setMessage("กรุณาเลือกอาหาร");
    setSending(true); setMessage("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart.map(({ id, quantity }) => ({ id, quantity })) }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "ส่งออเดอร์ไม่สำเร็จ");
      setCart([]);
      setMessage("ส่งออเดอร์ไปที่ครัวเรียบร้อยแล้ว 🔔");
    } catch (error) {
      setMessage(error.message || "ส่งออเดอร์ไม่สำเร็จ");
    } finally { setSending(false); }
  }

  if (loading) return <main className="container loading-page"><Brand compact /><p>กำลังโหลดเมนู...</p></main>;
  if (!session) return <main className="container"><div className="site-topbar"><Brand compact /></div><div className="card error-panel"><h1>ไม่พบโต๊ะ</h1><p className="error">{message || "Session ไม่ถูกต้อง"}</p></div></main>;

  return <main className="container order-page-new">
    <header className="order-topline"><Brand compact /><div className="order-table-badge"><span>TABLE</span><strong>{tableNumber}</strong></div></header>
    <section className="order-intro"><div><span className="menu-kicker">WAN HIMA • DESSERT BAR</span><h1>เลือกความหวาน<br /><em>สำหรับโต๊ะของคุณ</em></h1><p>เลือกบิงซูที่ชอบ แล้วกด + เพื่อเพิ่มลงในถาดสั่ง</p></div><div className="order-count-orb"><strong>{menuItems.length}</strong><span>เมนู</span></div></section>
    {categories.map((category) => {
      const items = menuItems.filter((item) => item.category_id === category.id);
      if (!items.length) return null;
      return <section key={category.id} className="menu-section"><div className="category-heading"><div className="category-title"><span className="category-marker"><SectionIcon type="menu" /></span><h2>{category.name}</h2></div><span>{items.length} เมนู</span></div>
        <div className="menu-grid">{items.map((item) => { const quantity = getQuantity(item.id); return <div className={`menu-card ${quantity ? "selected" : ""}`} key={item.id}>
          <div className="menu-image-wrap">{item.image_url ? <img className="menu-image" src={item.image_url} alt={item.name} /> : <div className="menu-placeholder"><SectionIcon type="menu" /></div>}</div>
          <div className="menu-info"><h3>{item.name}</h3><p>{item.description || "เมนูสดใหม่จากครัวหวานหิมะ บิงซู"}</p><strong>{Number(item.price).toLocaleString()} บาท</strong></div>
          <div className="quantity-control"><button className="qty-minus" onClick={() => changeQuantity(item, -1)} disabled={!quantity}>−</button><span>{quantity}</span><button className="qty-plus" onClick={() => changeQuantity(item, 1)}>+</button></div>
        </div>; })}</div>
      </section>;
    })}
    <section className="cart-card"><div className="cart-header"><div><div className="eyebrow">YOUR ORDER</div><h2>ถาดสั่งของคุณ</h2></div><div className="cart-count">{itemCount} รายการ</div></div>
      {!cart.length ? <p className="muted">ยังไม่มีรายการ เลือกเมนูด้านบนได้เลย</p> : <div className="cart-list">{cart.map((item) => <div className="cart-row" key={item.id}><div><strong>{item.name}</strong><div className="muted">{Number(item.price).toLocaleString()} บาท / ชิ้น</div></div><div className="cart-actions"><button onClick={() => changeQuantity(item, -1)}>−</button><span>{item.quantity}</span><button onClick={() => changeQuantity(item, 1)}>+</button><strong className="line-total">{(item.price * item.quantity).toLocaleString()} บาท</strong></div></div>)}</div>}
      <div className="order-total-line"><span>ยอดสั่งซื้อ</span><strong>{total.toLocaleString("th-TH", { minimumFractionDigits: 2 })} บาท</strong></div>
      <button className="submit-order-button" onClick={submitOrder} disabled={!cart.length || sending}>{sending ? "กำลังส่งออเดอร์..." : "ยืนยันออเดอร์ →"}</button>
      {message && <p className="notice success">{message}</p>}
    </section>
  </main>;
}
