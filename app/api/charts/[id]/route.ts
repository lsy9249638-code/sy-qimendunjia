import { NextRequest, NextResponse } from "next/server";
import { scoreChart } from "@/lib/qimen";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = createAdminClient();
    const { data, error } = await db.from("charts").select("*, palaces(*), forecast_notes(*)").eq("id", id).single();
    if (error) return NextResponse.json({ error: "未找到此盘" }, { status: 404 });
    data.palaces.sort((a: { position: number }, b: { position: number }) => a.position - b.position);
    return NextResponse.json({ chart: data, score: scoreChart(data.palaces) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "数据加载失败" }, { status: 503 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = createAdminClient();
  const { data: before } = await db.from("charts").select("*").eq("id", id).single();
  const { error } = await db.from("charts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await db.from("audit_logs").insert({ action: "chart.delete", entity_type: "chart", entity_id: id, payload: { before } });
  return new NextResponse(null, { status: 204 });
}
