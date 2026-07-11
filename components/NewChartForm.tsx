"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewChartForm() {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const now = new Date(); const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); setBusy(true); setError(""); const form = new FormData(e.currentTarget);
    try { const response = await fetch("/api/charts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ datetime: form.get("datetime"), purpose: form.get("purpose") }) }); const result = await response.json(); if (!response.ok) throw new Error(result.error); router.push(`/charts/${result.chart.id}`); router.refresh(); } catch (err) { setError(err instanceof Error ? err.message : "起盘失败"); setBusy(false); }
  }
  return <section className="plot-panel"><div className="plot-copy"><span>NEW CHART</span><h2>起一局</h2><p>以公历时刻排时家奇门九宫。时间按浏览器本地时区提交。</p></div><form onSubmit={submit}><label>所问时刻<input name="datetime" type="datetime-local" defaultValue={local} required /></label><label>所问事项<input name="purpose" placeholder="例如：明天适合签约吗？" maxLength={200} /></label><button disabled={busy}>{busy ? "正在排盘…" : "排盘"}<span>→</span></button>{error && <p className="form-error">{error}</p>}</form></section>;
}
