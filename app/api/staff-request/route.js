import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json({ message: "ฟังก์ชันนี้ถูกปิดจากหน้าเว็บลูกค้าแล้ว" }, { status: 410 });
}
