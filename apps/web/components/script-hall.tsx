"use client";

import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100";

type Script = { id: string; title: string; description: string; characterName: string; world: string; tags: string; participantCount: number; imageUrl?: string };
const charPortraits: Record<string, string> = { "洛因": "/characters/luoyin.png", "深野": "/characters/shenye.png", "秦淮": "/characters/qinhuai.png" };
function img(s: Script) { return (s as any).imageUrl || charPortraits[s.characterName] || null; }

const card = { background: "rgba(18,18,40,0.5)", borderRadius: 18, padding: 16, border: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" } as const;
const inp = { padding: "13px 16px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)", color: "#f0edf6", fontSize: 14, outline: "none", width: "100%" } as const;

export default function ScriptHall() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [selected, setSelected] = useState<Script | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [nf, setNf] = useState({ title: "", description: "", characterName: "", characterPrompt: "", world: "", tags: "", imageUrl: "" });

  useEffect(() => { fetch(`${API}/v1/scripts`).then(r => r.json()).then(d => setScripts(d.items || [])); }, []);

  async function open(s: Script) {
    setSelected(s);
    const r = await fetch(`${API}/v1/scripts/${s.id}`);
    if (r.ok) { const d = await r.json(); setMessages(d.messages || []); }
  }
  async function del(id: string) { if (!confirm("删除？")) return; await fetch(`${API}/v1/scripts/${id}`, { method: "DELETE" }); if (selected?.id === id) setSelected(null); refresh(); }
  async function refresh() { fetch(`${API}/v1/scripts`).then(r => r.json()).then(d => setScripts(d.items || [])); }
  async function create() { if (!nf.title) return; const r = await fetch(`${API}/v1/scripts`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...nf, creatorId: "demo-user" }) }); if (r.ok) { setShowCreate(false); setNf({ title: "", description: "", characterName: "", characterPrompt: "", world: "", tags: "", imageUrl: "" }); refresh(); } }
  async function sendMsg() {
    if (!input.trim() || !selected || loading) return;
    const t = input.trim(); setInput(""); setLoading(true);
    setMessages(prev => [...prev, { role: "user", content: t }]);
    const r = await fetch(`${API}/v1/scripts/${selected.id}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: "demo-user", content: t }) });
    if (r.ok) { const d = await r.json(); setMessages(prev => [...prev, d.reply]); }
    setLoading(false);
  }

  if (selected) {
    const p = img(selected);
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 56px - 80px)" }}>
        <div style={{ display: "flex", gap: 8, padding: "8px 0" }}>
          <button onClick={() => setSelected(null)} style={{ padding: "6px 14px", borderRadius: 16, background: "rgba(255,255,255,0.06)", color: "#8a87a0", fontSize: 13 }}>← 返回</button>
          <button onClick={() => del(selected.id)} style={{ padding: "6px 14px", borderRadius: 16, background: "rgba(255,123,147,0.1)", color: "#ff7b93", fontSize: 13, marginLeft: "auto" }}>删除</button>
        </div>
        {p && <img src={p} alt="" style={{ width: "100%", height: 140, borderRadius: 14, objectFit: "cover", marginBottom: 8 }} />}
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{selected.title}</div>
        <div style={{ color: "#8a87a0", fontSize: 13, marginBottom: 8 }}>{selected.description}</div>
        <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ padding: "10px 14px", borderRadius: 16, lineHeight: 1.6, maxWidth: "85%", alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? "linear-gradient(135deg, rgba(143,124,255,0.3), rgba(255,142,199,0.2))" : "rgba(255,255,255,0.04)", fontSize: 14 }}>
              {m.content}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, paddingTop: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="发言..." style={{ flex: 1, padding: "10px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(18,18,40,0.6)", color: "#f0edf6", fontSize: 14 }} />
          <button onClick={sendMsg} style={{ padding: "10px 16px", borderRadius: 20, background: "linear-gradient(135deg,#8f7cff,#ff8ec7)", color: "#fff", fontWeight: 600, fontSize: 14 }}>发送</button>
        </div>
      </div>
    );
  }

  if (showCreate) {
    return (
      <div style={{ paddingTop: 8 }}>
        <button onClick={() => setShowCreate(false)} style={{ padding: "6px 14px", borderRadius: 16, background: "rgba(255,255,255,0.06)", color: "#8a87a0", fontSize: 13, marginBottom: 14 }}>← 返回</button>
        <div className="card" style={{ background: "rgba(18,18,40,0.5)" }}>
          <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>创建新剧本</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input value={nf.title} onChange={e => setNf({ ...nf, title: e.target.value })} placeholder="剧本标题" style={inp} />
            <textarea value={nf.description} onChange={e => setNf({ ...nf, description: e.target.value })} placeholder="简介" style={{ ...inp, minHeight: 60, resize: "vertical" } as any} />
            <input value={nf.characterName} onChange={e => setNf({ ...nf, characterName: e.target.value })} placeholder="角色名称" style={inp} />
            <input value={nf.world} onChange={e => setNf({ ...nf, world: e.target.value })} placeholder="世界观" style={inp} />
            <textarea value={nf.characterPrompt} onChange={e => setNf({ ...nf, characterPrompt: e.target.value })} placeholder="角色 Prompt（性格、说话风格等）" style={{ ...inp, minHeight: 80, resize: "vertical" } as any} />
            <input value={nf.tags} onChange={e => setNf({ ...nf, tags: e.target.value })} placeholder="标签（逗号分隔）" style={inp} />
            <div>
              <label style={{ color: "#8a87a0", fontSize: 11, display: "block", marginBottom: 4 }}>角色立绘</label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input type="file" accept="image/*" onChange={async (e) => {
                  const file = e.target.files?.[0]; if (!file) return; setUploading(true);
                  const form = new FormData(); form.append("file", file);
                  try { const res = await fetch(`${API}/v1/scripts/upload`, { method: "POST", body: form }); if (res.ok) { const d = await res.json(); setNf({ ...nf, imageUrl: d.imageUrl }); } } catch {} finally { setUploading(false); }
                }} style={{ color: "#8a87a0", fontSize: 13 }} />
                {uploading && <span style={{ color: "#ffd78a", fontSize: 12 }}>上传中...</span>}
                {nf.imageUrl && !uploading && (
                  <img src={nf.imageUrl} alt="" style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)" }} />
                )}
              </div>
            </div>
            <button onClick={create} className="btn-primary" style={{ width: "100%", marginTop: 4 }}>发布剧本</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 8, animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>剧本大厅</h2>
        <button onClick={() => setShowCreate(true)} className="btn-primary" style={{ fontSize: 13, padding: "8px 16px" }}>+ 创建</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {scripts.map(s => {
          const p = img(s);
          return (
            <div key={s.id} onClick={() => open(s)} className="card" style={{ display: "flex", gap: 14, alignItems: "center", cursor: "pointer", background: "rgba(18,18,40,0.5)" }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, overflow: "hidden", flexShrink: 0, background: p ? "transparent" : "rgba(143,124,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                {p ? <img src={p} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "📜"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{s.title}</div>
                <div style={{ color: "#8a87a0", fontSize: 12, margin: "3px 0" }}>{s.description.slice(0, 40)}</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ color: "#8a87a0", fontSize: 11 }}>{s.participantCount} 人</span>
                  {s.tags.split(",").filter(Boolean).slice(0, 2).map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); del(s.id); }} style={{ color: "#ff7b93", fontSize: 12, padding: "4px 8px" }}>删除</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
