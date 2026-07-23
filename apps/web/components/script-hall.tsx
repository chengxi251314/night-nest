"use client";

import { useState, useEffect } from "react";
import { Plus, X, Play, Bot, Check } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100";

type Script = { id: string; title: string; description: string; world: string; tags: string; participantCount: number; imageUrl?: string };
type ScriptChar = { id?: string; name: string; prompt: string; imageUrl: string; characterId?: string; charAvatar?: string; charName?: string };
type Message = { id: string; userId: string; role: string; content: string; createdAt: string };

const charPortraits: Record<string, string> = { "洛因": "/characters/luoyin.png", "深野": "/characters/shenye.png", "秦淮": "/characters/qinhuai.png" };
function img(s: Script) { return (s as any).imageUrl || null; }

const inp = { padding: "10px 14px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)", color: "#f0edf6", fontSize: 14, outline: "none", width: "100%" } as const;

export default function ScriptHall() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [characters, setCharacters] = useState<ScriptChar[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [allChars, setAllChars] = useState<any[]>([]);
  const [nf, setNf] = useState({ title: "", description: "", world: "", tags: "", imageUrl: "" });
  const [selectedCharIds, setSelectedCharIds] = useState<Set<string>>(new Set());

  useEffect(() => { refresh(); fetch(API + "/v1/characters").then(r => r.json()).then(d => setAllChars(d.items || [])); }, []);

  async function refresh() { fetch(API + "/v1/scripts").then(r => r.json()).then(d => setScripts(d.items || [])); }

  async function open(s: Script) {
    const r = await fetch(API + "/v1/scripts/" + s.id);
    if (r.ok) {
      const d = await r.json();
      setSelected(d.script);
      setMessages(d.messages || []);
      setCharacters(d.characters || []);
    }
  }

  async function del(id: string) { if (!confirm("删除？")) return; await fetch(API + "/v1/scripts/" + id, { method: "DELETE" }); if (selected?.id === id) setSelected(null); refresh(); }

  async function create() {
    if (!nf.title || selectedCharIds.size < 2) return;
    const chars = allChars.filter(c => selectedCharIds.has(c.id)).map(c => ({
      name: c.name,
      prompt: "",
      imageUrl: c.imageUrl || "/characters/" + c.id + ".png",
      characterId: c.id
    }));
    await fetch(API + "/v1/scripts", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...nf, characters: chars, characterName: chars.map(c => c.name).join(" & "), creatorId: "demo-user" })
    }).then(r => {
      if (r.ok) {
        setShowCreate(false);
        setNf({ title: "", description: "", world: "", tags: "", imageUrl: "" });
        setSelectedCharIds(new Set());
        refresh();
      }
    });
  }

  async function sendMsg() {
    if (!input.trim() || !selected || loading) return;
    const t = input.trim(); setInput(""); setLoading(true);
    setMessages(prev => [...prev, { id: "u-" + Date.now(), userId: "user", role: "user", content: t, createdAt: "" }]);
    const r = await fetch(API + "/v1/scripts/" + selected.id + "/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: "demo-user", content: t }) });
    if (r.ok) { const d = await r.json(); setMessages(prev => [...prev, { id: "r-" + Date.now(), userId: "system", role: d.reply.role, content: d.reply.text, createdAt: "" }]); }
    setLoading(false);
  }

  async function triggerAutoDialogue() {
    if (!selected || autoPlaying) return;
    setAutoPlaying(true);
    try {
      const r = await fetch(API + "/v1/scripts/" + selected.id + "/auto-dialogue", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rounds: 6 }) });
      if (r.ok) {
        const d = await r.json();
        if (!d.error && d.messages) {
          const newMsgs = d.messages.map((m: any) => ({ id: "a-" + Date.now() + Math.random(), userId: "system", role: "character", content: m.speaker + "：" + m.content, createdAt: "" }));
          setMessages(prev => [...prev, ...newMsgs]);
        }
      }
    } catch { /* */ }
    setAutoPlaying(false);
  }

  function toggleChar(id: string) {
    setSelectedCharIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  // DETAIL
  if (selected) {
    const hasChars = characters.length >= 2;
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 56px - 80px)" }}>
        <div style={{ display: "flex", gap: 8, padding: "8px 0", flexWrap: "wrap" }}>
          <button onClick={() => setSelected(null)} style={{ padding: "6px 14px", borderRadius: 16, background: "rgba(255,255,255,0.06)", color: "#8a87a0", fontSize: 13 }}>← 返回</button>
          {hasChars && (
            <button onClick={triggerAutoDialogue} disabled={autoPlaying} style={{ padding: "6px 14px", borderRadius: 16, background: autoPlaying ? "rgba(255,215,138,0.06)" : "rgba(255,215,138,0.12)", color: autoPlaying ? "#8a87a0" : "#ffd78a", fontSize: 13, display: "flex", alignItems: "center", gap: 4, border: "1px solid rgba(255,215,138,0.15)" }}>
              <Play size={13} /> {autoPlaying ? "生成中..." : "角色自主对话"}
            </button>
          )}
          <button onClick={() => del(selected.id)} style={{ padding: "6px 14px", borderRadius: 16, background: "rgba(255,123,147,0.1)", color: "#ff7b93", fontSize: 13, marginLeft: "auto" }}>删除</button>
        </div>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{selected.title}</div>
        <div style={{ color: "#8a87a0", fontSize: 13, marginBottom: 6 }}>{selected.description}</div>
        {characters.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            {characters.map((c: ScriptChar, i: number) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 16, background: "rgba(143,124,255,0.08)", border: "1px solid rgba(143,124,255,0.12)", fontSize: 13, color: "#c4b8ff" }}>
                {c.charAvatar ? <img src={c.charAvatar} alt="" style={{ width: 20, height: 20, borderRadius: 5, objectFit: "cover" }} /> : <Bot size={14} />}
                {c.charName || c.name}
              </div>
            ))}
          </div>
        )}
        <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ padding: "8px 14px", borderRadius: 14, lineHeight: 1.55, maxWidth: "85%", alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? "linear-gradient(135deg, rgba(143,124,255,0.3), rgba(255,142,199,0.15))" : "rgba(255,255,255,0.03)", fontSize: 14 }}>{m.content}</div>
          ))}
          {messages.length === 0 && <div style={{ color: "#8a87a0", fontSize: 13, textAlign: "center", padding: 30 }}>{hasChars ? "点击「角色自主对话」开始" : ""}</div>}
        </div>
        <div style={{ display: "flex", gap: 8, paddingTop: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} placeholder="发言..." style={{ flex: 1, padding: "10px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(18,18,40,0.6)", color: "#f0edf6", fontSize: 14 }} />
          <button onClick={sendMsg} style={{ padding: "10px 16px", borderRadius: 20, background: "linear-gradient(135deg,#8f7cff,#ff8ec7)", color: "#fff", fontWeight: 600, fontSize: 14 }}>发送</button>
        </div>
      </div>
    );
  }

  // CREATE
  if (showCreate) {
    return (
      <div style={{ paddingTop: 8 }}>
        <button onClick={() => setShowCreate(false)} style={{ padding: "6px 14px", borderRadius: 16, background: "rgba(255,255,255,0.06)", color: "#8a87a0", fontSize: 13, marginBottom: 14 }}>← 返回</button>
        <div className="card" style={{ background: "rgba(18,18,40,0.5)" }}>
          <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>创建新剧本</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input value={nf.title} onChange={e => setNf({ ...nf, title: e.target.value })} placeholder="剧本标题" style={inp} />
            <textarea value={nf.description} onChange={e => setNf({ ...nf, description: e.target.value })} placeholder="简介" style={{ ...inp, minHeight: 50, resize: "vertical" } as any} />
            <input value={nf.world} onChange={e => setNf({ ...nf, world: e.target.value })} placeholder="世界观" style={inp} />
            <input value={nf.tags} onChange={e => setNf({ ...nf, tags: e.target.value })} placeholder="标签（逗号分隔）" style={inp} />

            {/* Pick characters */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
              <div style={{ color: "#ffd78a", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>选择角色 <span style={{ color: "#8a87a0", fontSize: 11, fontWeight: 400 }}>（至少2个）</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {allChars.map((c: any) => {
                  const sel = selectedCharIds.has(c.id);
                  return (
                    <button key={c.id} onClick={() => toggleChar(c.id)} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 14,
                      background: sel ? "rgba(143,124,255,0.12)" : "rgba(255,255,255,0.02)",
                      border: "1px solid " + (sel ? "rgba(143,124,255,0.25)" : "rgba(255,255,255,0.05)"),
                      cursor: "pointer", textAlign: "left", width: "100%"
                    }}>
                      <img src={c.imageUrl || "/characters/" + c.id + ".png"} alt="" style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover", border: sel ? "2px solid #8f7cff" : "2px solid transparent" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: sel ? "#f0edf6" : "#c0bdd6" }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: "#8a87a0" }}>{c.title}</div>
                      </div>
                      {sel && <Check size={16} color="#8f7cff" />}
                    </button>
                  );
                })}
              </div>
              {selectedCharIds.size > 0 && (
                <div style={{ marginTop: 8, color: "#8a87a0", fontSize: 12 }}>已选 {selectedCharIds.size} 个角色</div>
              )}
            </div>

            <div>
              <label style={{ color: "#8a87a0", fontSize: 11, display: "block", marginBottom: 4 }}>封面图</label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input type="file" accept="image/*" onChange={async (e) => {
                  const file = e.target.files?.[0]; if (!file) return; setUploading(true);
                  const form = new FormData(); form.append("file", file);
                  try { const res = await fetch(API + "/v1/scripts/upload", { method: "POST", body: form }); if (res.ok) { const d = await res.json(); setNf({ ...nf, imageUrl: d.imageUrl }); } } catch { } finally { setUploading(false); }
                }} style={{ color: "#8a87a0", fontSize: 13 }} />
                {uploading && <span style={{ color: "#ffd78a", fontSize: 12 }}>上传中...</span>}
                {nf.imageUrl && !uploading && <img src={nf.imageUrl} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover" }} />}
              </div>
            </div>
            <button onClick={create} className="btn-primary" style={{ width: "100%", marginTop: 4, opacity: selectedCharIds.size < 2 ? 0.5 : 1 }}>
              {selectedCharIds.size < 2 ? "请选择至少2个角色" : "发布剧本"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LIST
  return (
    <div style={{ paddingTop: 8, animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>剧本大厅</h2>
        <button onClick={() => setShowCreate(true)} style={{ fontSize: 13, padding: "8px 16px", borderRadius: 14, background: "linear-gradient(135deg,#8f7cff,#ff8ec7)", color: "#fff", fontWeight: 600, border: "none", cursor: "pointer" }}>+ 创建</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {scripts.map(s => (
          <div key={s.id} onClick={() => open(s)} style={{ display: "flex", gap: 12, alignItems: "center", cursor: "pointer", background: "rgba(18,18,40,0.5)", padding: 14, borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ width: 50, height: 50, borderRadius: 12, overflow: "hidden", flexShrink: 0, background: "rgba(143,124,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
              {s.imageUrl ? <img src={s.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "📜"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{s.title}</div>
              <div style={{ color: "#8a87a0", fontSize: 12, margin: "2px 0" }}>{s.description.slice(0, 35)}</div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ color: "#8a87a0", fontSize: 11 }}>{s.participantCount} 人关注</span>
                {s.tags.split(",").filter(Boolean).slice(0, 2).map(t => <span key={t} style={{ padding: "2px 8px", borderRadius: 8, fontSize: 10, background: "rgba(255,215,138,0.06)", color: "#ffd78a" }}>{t}</span>)}
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); del(s.id); }} style={{ color: "#ff7b93", fontSize: 11, padding: "4px 8px" }}>删除</button>
          </div>
        ))}
      </div>
    </div>
  );
}
