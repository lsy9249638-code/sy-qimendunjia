import { NextRequest, NextResponse } from "next/server";
import { computeChart, scoreChart, tagPurpose } from "@/lib/qimen";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const db = createAdminClient();
    const { data, error } = await db.from("charts").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ charts: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "数据加载失败" }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.datetime || Number.isNaN(new Date(body.datetime).getTime())) return NextResponse.json({ error: "请选择有效日期和时辰" }, { status: 400 });
    const purpose = String(body.purpose || "").trim();
    if (purpose.length > 200) return NextResponse.json({ error: "所问事项不能超过 200 字" }, { status: 400 });
    const computed = computeChart(body.datetime);
    const db = createAdminClient();
    const { data: chart, error } = await db.from("charts").insert({ ...computed, palaces: undefined, purpose: purpose ? `${tagPurpose(purpose)} · ${purpose}` : "其他" }).select().single();
    if (error) throw error;
    const { error: palaceError } = await db.from("palaces").insert(computed.palaces.map((p) => ({ ...p, chart_id: chart.id })));
    if (palaceError) { await db.from("charts").delete().eq("id", chart.id); throw palaceError; }
    await db.from("audit_logs").insert({ action: "chart.create", entity_type: "chart", entity_id: chart.id, payload: { chart, palace_count: 9 } });
    return NextResponse.json({ chart: { ...chart, palaces: computed.palaces, score: scoreChart(computed.palaces) } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "起盘失败" }, { status: 500 });
  }
}
