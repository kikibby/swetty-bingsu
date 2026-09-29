import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
export async function GET(request){
 try{
  const kind=new URL(request.url).searchParams.get("kind");
  if(kind==="sessions"){
   const {data,error}=await supabaseAdmin.from("sessions").select("id,table_number,adult_count,child_count,status,opened_at,closed_at").order("opened_at",{ascending:false});
   if(error)throw error; return NextResponse.json({sessions:data||[]});
  }
  const start=new URL(request.url).searchParams.get("start");
  let query=supabaseAdmin.from("orders").select("id,queue_number,table_number,items,total,status,created_at").order("created_at",{ascending:true});
  if(start)query=query.gte("created_at",start);
  const {data,error}=await query;if(error)throw error;return NextResponse.json({orders:data||[]});
 }catch(error){return NextResponse.json({message:error.message||"โหลด Dashboard ไม่สำเร็จ"},{status:500})}
}
