import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.from("orders").select("id,queue_number,table_number,items,total,status,created_at").neq("status", "served").order("queue_number", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ orders: data || [] });
  } catch (error) {
    return NextResponse.json({ message: error.message || "โหลดคิวครัวไม่สำเร็จ" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, status } = await request.json();
    if (!id || !["received", "preparing", "ready", "served"].includes(status)) return NextResponse.json({ message: "ข้อมูลสถานะไม่ถูกต้อง" }, { status: 400 });
    const { error } = await supabaseAdmin.from("orders").update({ status }).eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ message: error.message || "เปลี่ยนสถานะคิวไม่สำเร็จ" }, { status: 500 });
  }
}
