import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import NewChartForm from "@/components/NewChartForm";

export const dynamic = "force-dynamic";

export default async function Home() {
  let charts: Array<{ id: string; title: string; purpose: string | null; chart_datetime: string }> = [];
  let failed = false;
  try {
    const { data, error } = await createAdminClient().from("charts").select("id,title,purpose,chart_datetime").order("created_at", { ascending: false });
    if (error) throw error;
    charts = data || [];
  } catch { failed = true; }
  return <main className="shell">
    <header className="mast"><div><span className="seal">奇</span><p>时家奇门 · 私人盘局</p></div><h1>顺时察势，<em>一盘见机。</em></h1><p className="lede">选择所问时刻，排布九宫，记录并发布你的判断。</p></header>
    <NewChartForm />
    <section className="section"><div className="section-title"><div><span>ARCHIVE</span><h2>最近盘局</h2></div><b>{charts.length.toString().padStart(2, "0")}</b></div>
      {failed ? <p className="notice error">数据加载失败，请刷新重试</p> : charts.length === 0 ? <p className="notice">还没有盘，点击上方开始起盘</p> : <div className="chart-list">{charts.map((chart, i) => <Link className="chart-card" href={`/charts/${chart.id}`} key={chart.id}><span className="index">{String(i + 1).padStart(2, "0")}</span><div><h3>{chart.title}</h3><p>{chart.purpose || "未注明所问事项"}</p></div><time>{new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kuala_Lumpur" }).format(new Date(chart.chart_datetime))}</time><span className="arrow">↗</span></Link>)}</div>}
    </section>
  </main>;
}
