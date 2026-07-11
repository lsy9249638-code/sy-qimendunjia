import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { scoreChart } from "@/lib/qimen";
import NotePanel from "@/components/NotePanel";

export const dynamic = "force-dynamic";
export default async function ChartPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const { data: chart, error } = await createAdminClient().from("charts").select("*,palaces(*),forecast_notes(*)").eq("id", id).single(); if (error || !chart) notFound(); chart.palaces.sort((a: {position:number}, b: {position:number}) => a.position-b.position); const score = scoreChart(chart.palaces);
  return <main className="shell detail"><nav><Link href="/">← 返回盘局</Link><span>奇门时盘</span></nav><header className="chart-head"><div><span>{chart.purpose || "其他"}</span><h1>{chart.title}</h1><p>{new Intl.DateTimeFormat("zh-CN", { dateStyle: "full", timeStyle: "short", timeZone: "Asia/Kuala_Lumpur" }).format(new Date(chart.chart_datetime))}</p></div><div className="score"><b>{score}</b><span>/ 10<br/>吉势评分</span></div></header><div className="pillars"><span>年干 <b>{chart.year_stem}</b></span><span>月干 <b>{chart.month_stem}</b></span><span>日干 <b>{chart.day_stem}</b></span><span>时干 <b>{chart.hour_stem}</b></span><span>值符 <b>{chart.duty_chief}</b></span></div><section className="palace-grid">{chart.palaces.map((p: any) => <article className={p.eight_deity === chart.duty_chief ? "chief" : ""} key={p.id}><header><b>{p.direction}宫</b><span>{p.position}</span></header><div className="stem">{p.heavenly_stem || "—"}</div><dl><div><dt>门</dt><dd>{p.eight_gate || "—"}</dd></div><div><dt>神</dt><dd>{p.eight_deity || "—"}</dd></div><div><dt>星</dt><dd>{p.eight_star || "—"}</dd></div></dl>{p.is_void && <i>空</i>}</article>)}</section><NotePanel chartId={chart.id} notes={chart.forecast_notes || []} /></main>;
}
