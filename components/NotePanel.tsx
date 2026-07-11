"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Note = { id: string; content: string; published: boolean; source: string; review_status: string };
export default function NotePanel({ chartId, notes }: { chartId: string; notes: Note[] }) {
  const router = useRouter(); const existing = notes.find((n) => n.source === "owner"); const [content, setContent] = useState(existing?.content || ""); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  async function save(published: boolean) { if (!content.trim()) return setError("请先写下解盘内容"); setBusy(true); setError(""); const method = existing ? "PATCH" : "POST"; const url = existing ? `/api/forecast-notes/${existing.id}` : "/api/forecast-notes"; const response = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify({ chart_id: chartId, content, published }) }); const result = await response.json(); if (!response.ok) setError(result.error || "保存失败"); else router.refresh(); setBusy(false); }
  return <section className="notes"><div className="section-title"><div><span>FORECAST</span><h2>解盘札记</h2></div></div><div className="published">{notes.filter((n) => n.published).length ? notes.filter((n) => n.published).map((n) => <blockquote key={n.id}>{n.content}</blockquote>) : <p>暂无公开解盘。</p>}</div><label>编辑札记<textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="记录格局、用神与行动建议…" rows={6} /></label><div className="note-actions"><button className="secondary" disabled={busy} onClick={() => save(false)}>保存草稿</button><button disabled={busy} onClick={() => save(true)}>发布札记</button></div>{error && <p className="form-error">{error}</p>}</section>;
}
