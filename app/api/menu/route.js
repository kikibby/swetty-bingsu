import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const [{ data: categories, error: categoryError }, { data: items, error: itemError }] = await Promise.all([
      supabaseAdmin.from("menu_categories").select("id,name,sort_order").order("sort_order", { ascending: true }),
      supabaseAdmin.from("menu_items").select("id,category_id,name,description,price,image_url,is_available").eq("is_available", true),
    ]);
    if (categoryError) throw categoryError;
    if (itemError) throw itemError;

    const availableItems = items || [];
    const categoryRows = (categories || []).filter((category) => availableItems.some((item) => item.category_id === category.id));
    if (!categoryRows.length && availableItems.length) {
      return NextResponse.json({
        categories: [{ id: "__featured", name: "บิงซูทั้งหมด", sort_order: 1 }],
        items: availableItems.map((item) => ({ ...item, category_id: "__featured" })),
      });
    }
    return NextResponse.json({ categories: categoryRows, items: availableItems });
  } catch (error) {
    console.error("Menu API error:", error);
    return NextResponse.json({ message: error.message || "โหลดเมนูไม่สำเร็จ" }, { status: 500 });
  }
}
