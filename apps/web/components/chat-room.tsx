"use client";

import { useState, useEffect, useRef } from "react";
import { characters, type Character } from "@/lib/data";
import { getLLMConfig } from "@/components/llm-settings";
import { ds } from "@/lib/design-system";

type Message = { role: "system" | "character" | "user"; text: string };
type Relationship = { characterId: string; score: number; stage: string; mood: string };

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100";

export default function ChatRoom() {
  const [char, setChar] = useState<Character>(characters[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [rel, setRel] = useState<Relationship | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const t = ds.character[char.id as keyof typeof ds.character] || ds.character.luoyin;
  useEffect(() => { document.body.setAttribute('data-char', char.id); return () => document.body.removeAttribute('data-char'); }, [char.id]);

  useEffect(() => { load(char.id); }, [char.id]);
  useEffect(() => { ref.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function load(id: string) {
    try {
      const [a, b] = await Promise.all([fetch(`${API}/v1/conversations/${id}/seed`), fetch(`${API}/v1/relationships/${id}`)]);
      if (a.ok) setMessages((await a.json()).messages);
      if (b.ok) setRel(await b.json());
    } catch {}
  }
  async function send() {
    const v = input.trim(); if (!v || loading) return;
    setInput(""); setLoading(true); setMessages(p => [...p, { role: "user", text: v }]);
    try {
      const r = await fetch(`${API}/v1/conversations/${char.id}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: v, ...getLLMConfig() }) });
      if (r.ok) {
        const d = await r.json(); setMessages(p => [...p, d.reply]);
        const b = await fetch(`${API}/v1/relationships/${char.id}`);
        if (b.ok) { const rd = await b.json(); if (rel && rd.score !== rel.score) { setFlash(rd.score - rel.score); setTimeout(() => setFlash(null), 1500); } setRel(rd); }
      }
    } catch {} finally { setLoading(false); }
  }
  function sw(id: string) { const f = characters.find(c => c.id === id); if (f) setChar(f); }
  function pct(): number {
    if (!rel) return 0; let p = 0; for (const s of char.stages) { if (rel.score <= s.max) return ((rel.score - p) / (s.max - p)) * 100; p = s.max; } return 100;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 56px - 80px)" }}>
      {/* Banner */}
      <div style={{ margin: "0 -16px", padding: `${ds.space.lg}px ${ds.space.lg}px ${ds.space.xl}px`, background: `linear-gradient(180deg, ${t.dark}, transparent)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -30, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${t.glow}, transparent 70%)` }} />
        <div style={{ position: "absolute", bottom: 0, left: "15%", width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${t.light}, transparent 70%)` }} />

        {/* Tabs */}
        <div style={{ display: "flex", gap: ds.space.sm, overflowX: "auto", marginBottom: ds.space.lg, position: "relative", zIndex: 1 }}>
          {characters.map(c => {
            const a = c.id === char.id;
            return (
              <button key={c.id} onClick={() => sw(c.id)} style={{
                padding: `${ds.space.sm}px ${ds.space.lg}px`, borderRadius: ds.radius.full, fontSize: ds.type.caption.size, fontWeight: a ? ds.type.h3.weight : ds.type.body.weight, flexShrink: 0,
                background: a ? t.light : "rgba(255,255,255,0.03)", color: a ? "#fff" : ds.color.muted,
                border: `1px solid ${a ? t.glow : "rgba(255,255,255,0.04)"}`,
                boxShadow: a ? `0 0 20px ${t.glow}` : "none", transition: ds.anim.normal,
              }}>{c.name}</button>
            );
          })}
        </div>

        {/* Header card */}
        <div style={{ display: "flex", alignItems: "center", gap: ds.space.lg, background: "rgba(0,0,0,0.25)", borderRadius: ds.radius.xl, padding: ds.space.lg, border: `1px solid ${t.light}`, position: "relative", zIndex: 1, backdropFilter: "blur(12px)" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ position: "absolute", inset: -4, borderRadius: ds.radius.xl, background: t.glow, filter: "blur(10px)", opacity: 0.5 }} />
            <img src={`/characters/${char.id}.png`} style={{ width: 56, height: 56, borderRadius: ds.radius.lg, objectFit: "cover", position: "relative", zIndex: 1, border: `2px solid ${t.main}` }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: ds.type.h3.size, fontWeight: ds.type.h3.weight }}>{char.name}</div>
            {rel && <div style={{ color: ds.color.muted, fontSize: ds.type.caption.size, marginTop: 2 }}>{rel.stage} · {rel.mood}</div>}
          </div>
          {rel && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: ds.type.display.weight, color: t.main }}>{rel.score}</div>
              {flash && <div style={{ color: ds.color.emerald, fontSize: ds.type.caption.size, fontWeight: 700, animation: "fadeUp 1.5s ease-out" }}>+{flash}</div>}
            </div>
          )}
        </div>

        {/* Progress */}
        <div style={{ height: 4, borderRadius: ds.radius.full, background: "rgba(255,255,255,0.04)", marginTop: ds.space.md, overflow: "hidden", position: "relative", zIndex: 1 }}>
          <div style={{ height: "100%", borderRadius: ds.radius.full, width: `${pct()}%`, background: `linear-gradient(90deg, ${t.main}, ${t.main}88)`, transition: "width 0.6s ease", boxShadow: `0 0 14px ${t.glow}` }} />
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: ds.space.sm, padding: `${ds.space.md}px 0` }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            padding: `${ds.space.md}px ${ds.space.lg}px`, borderRadius: ds.radius.xl, lineHeight: ds.type.body.lineHeight, maxWidth: "84%",
            alignSelf: m.role === "user" ? "flex-end" : m.role === "system" ? "center" : "flex-start",
            background: m.role === "user" ? `linear-gradient(135deg, ${t.light}, rgba(143,124,255,0.12))` : m.role === "system" ? "rgba(255,215,138,0.06)" : "rgba(255,255,255,0.04)",
            border: m.role === "user" ? `1px solid ${t.glow}` : "1px solid rgba(255,255,255,0.03)",
            color: m.role === "system" ? ds.color.gold : ds.color.text, fontSize: ds.type.body.size,
            animation: "fadeIn 0.3s ease",
          }}>{m.text}</div>
        ))}
        {loading && (
          <div style={{ padding: `${ds.space.md}px ${ds.space.lg}px`, color: ds.color.muted, fontSize: ds.type.caption.size, alignSelf: "flex-start", display: "flex", gap: ds.space.sm, alignItems: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.main, animation: "glowPulse 1.5s ease-in-out infinite" }} />
            对方正在输入...
          </div>
        )}
        <div ref={ref} />
      </div>

      {/* Quick actions */}
      <div className="hide-mobile" style={{ display: "flex", gap: ds.space.sm, flexWrap: "wrap", paddingBottom: ds.space.sm }}>
        {char.quickActions.map(a => (
          <button key={a} onClick={() => setInput(a)} style={{ ...ds.btn.ghost, fontSize: ds.type.caption.size, background: t.light, color: t.main, border: `1px solid ${t.glow}` }}>{a}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: ds.space.sm, paddingTop: ds.space.sm }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder={`对${char.name}说点什么...`} disabled={loading}
          style={{ ...ds.input, flex: 1, border: `1px solid ${t.light}`, background: "rgba(14,14,36,0.7)", borderRadius: ds.radius.full }} />
        <button onClick={send} disabled={loading} style={{
          ...ds.btn.primary, fontSize: ds.type.body.size, flexShrink: 0,
          background: `linear-gradient(135deg, ${t.main}, ${t.main}cc)`, boxShadow: `0 4px 20px ${t.glow}`
        }}>发送</button>
      </div>
    </div>
  );
}
