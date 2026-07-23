"use client";

import { useState, useEffect, useRef } from "react";
import { characters, type Character } from "@/lib/data";
import { getLLMConfig } from "@/components/llm-settings";
import { ds } from "@/lib/design-system";
import TheaterPlayer from "@/components/theater-player";
import { theaters } from "@/lib/theater-data";
import InvitationFlow from "@/components/invitation-flow";
import { invitations } from "@/lib/invitations";
import BadgeUnlock, { checkBadge, resetBadges } from "@/components/badge-unlock";
import { playPing, playUnlock } from "@/lib/sounds";

type Message = { role: "system" | "character" | "user"; text: string };
type Relationship = { characterId: string; score: number; stage: string; mood: string };

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100";

export default function ChatRoom() {
  const [allChars, setAllChars] = useState<Character[]>(characters);
  const [char, setChar] = useState<Character>(characters[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [rel, setRel] = useState<Relationship | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState<number | null>(null);
  const [showTheater, setShowTheater] = useState(false);
  const [activeInvitation, setActiveInvitation] = useState<any>(null);
  const [badge, setBadge] = useState<any>(null);
  const ref = useRef<HTMLDivElement>(null);
  const lastActive = useRef(Date.now());
  const idleCount = useRef(0);
  const t = ds.character[char.id as keyof typeof ds.character] || ds.character.luoyin;

  // Load characters from API + hardcoded
  useEffect(() => {
    fetch(API + "/v1/characters").then(r => r.json()).then(d => {
      if (d.items && Array.isArray(d.items)) {
        const apiOnly = d.items.filter((c: any) => !characters.find(hc => hc.id === c.id));
        setAllChars([...characters, ...apiOnly.map((c: any) => ({
          id: c.id, name: c.name || "", title: c.title || "", tagline: c.tagline || "",
          intro: c.intro || "", world: c.world || "", traits: c.traits || [],
          stages: c.stages || [{ max: 100, label: "", hint: "" }],
          memories: c.memories || [], quickActions: c.quickActions || [],
          story: c.story || [], imageUrl: c.imageUrl || "",
        }))]);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => { document.body.setAttribute("data-char", char.id); return () => document.body.removeAttribute("data-char"); }, [char.id]);
  useEffect(() => { load(char.id); idleCount.current = 0; lastActive.current = Date.now(); }, [char.id]);
  useEffect(() => { ref.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { if (typeof Notification !== "undefined" && Notification.permission === "default") Notification.requestPermission(); }, []);

  // Idle: AI generates proactive messages, intimacy decays on prolonged silence
  useEffect(() => {
    const score = rel?.score || 0;
    const interval = score >= 85 ? 25000 : score >= 60 ? 35000 : score >= 30 ? 50000 : 80000;
    const maxIdle = score >= 85 ? 8 : score >= 60 ? 5 : score >= 30 ? 3 : 2;
    const timer = setInterval(async () => {
      if (idleCount.current >= maxIdle || messages.length === 0) return;
      const cfg = getLLMConfig();
      let text = "";
      try {
        const r = await fetch("http://localhost:8000/v1/orchestrate", {
          method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ character_id: char.id, user_message: "请根据你们之前的对话内容，以角色性格自然地主动说一句话。要贴合之前聊的话题，不要重复说过的话。1-2句话即可。", memories: [], conversation_history: messages.slice(-6).map(function(m) { return { role: m.role, content: m.text }; }), relationship_stage: rel?.stage || "", relationship_score: rel?.score || 0, api_key: cfg.apiKey, base_url: cfg.baseUrl, model: cfg.model })
        });
        if (r.ok) { const d = await r.json(); text = d.reply || ""; }
      } catch {}
        if (!text) text = "...";
        setMessages(p => [...p, { role: "character", text }]);
        // Persist to DB so messages survive page navigation
        try { await fetch(API + "/v1/conversations/" + char.id + "/persist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role: "character", content: text }) }); } catch {}
        idleCount.current++;
      playPing();
      if (idleCount.current >= 3 && rel) {
        const decay = -Math.floor(Math.random() * 3) - 1;
        const ns = Math.max(0, rel.score + decay);
        setRel({ ...rel, score: ns });
        setFlash(decay);
        setTimeout(() => setFlash(null), 2000);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [char.id, rel?.score]);

  async function load(id: string) {
    try {
      const a = await fetch(API + "/v1/conversations/" + id + "/seed");
      if (a.ok) setMessages((await a.json()).messages);
      const b = await fetch(API + "/v1/relationships/" + id);
      if (b.ok) { const data = await b.json(); setRel(data); }
    } catch {}
  }

  function checkInvites(prev: number, next: number) {
    const invs = invitations[char.id]; if (!invs) return;
    let m: any = null; for (const i of invs) { if (next >= i.scoreThreshold && prev < i.scoreThreshold) m = i; }
    if (m) setActiveInvitation(m);
  }

  async function send() {
    const v = input.trim(); if (!v || loading) return;
    setInput(""); setLoading(true);
    lastActive.current = Date.now();
    idleCount.current = 0;
    setMessages(p => [...p, { role: "user", text: v }]);
    try {
      const r = await fetch(API + "/v1/conversations/" + char.id + "/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: v, ...getLLMConfig() }) });
      if (r.ok) {
          const d = await r.json(); setMessages(p => [...p, d.reply]); playPing();
          if (rel) {
            // Use API's relationship_delta instead of local random
          const delta = d.relationship_delta || Math.floor(Math.random() * 5) + 1;
          const ns = Math.min(100, rel.score + delta);
          console.log("Score update:", rel.score, "+", delta, "=", ns, "rel keys:", Object.keys(rel));
          const ps = rel.score;
          setFlash(delta); setTimeout(() => setFlash(null), 1500);
          checkInvites(ps, ns);
          if (ns >= 92 && ps < 92) setTimeout(() => setShowTheater(true), 800);
          const bg = checkBadge(char.name, ps, ns); if (bg) { setBadge(bg); playUnlock(); }
          setRel({ ...rel, score: ns });
        }
        if (Math.random() < 0.4) setTimeout(async () => {
          const r2 = await fetch(API + "/v1/conversations/" + char.id + "/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: "(continue)", ...getLLMConfig() }) });
          if (r2.ok) { const d2 = await r2.json(); setMessages(p => [...p, d2.reply]); playPing(); }
        }, 2500);
      }
    } catch {} finally { setLoading(false); }
  }

  function sw(id: string) { resetBadges(); const f = allChars.find(c => c.id === id); if (f) setChar(f); }

  function getImage(c: Character) { return (c as any).imageUrl || `/characters/${c.id}.png`; }

  function pct(): number { if (!rel) return 0; let p = 0; for (const s of char.stages) { if (rel.score <= s.max) return ((rel.score - p) / (s.max - p)) * 100; p = s.max; } return 100; }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 56px - 80px)" }}>
      <div style={{ margin: "0 -16px", padding: "16px 16px 20px", background: `linear-gradient(180deg, ${t.dark}, transparent)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -30, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${t.glow}, transparent 70%)` }} />
        <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 14, position: "relative", zIndex: 1 }}>
          {allChars.map(c => { const a = c.id === char.id; return <button key={c.id} onClick={() => sw(c.id)} style={{ padding: "8px 16px", borderRadius: 20, fontSize: 13, flexShrink: 0, fontWeight: a ? 600 : 400, background: a ? t.light : "rgba(255,255,255,0.03)", color: a ? "#fff" : ds.color.muted, border: `1px solid ${a ? t.glow : "rgba(255,255,255,0.04)"}`, boxShadow: a ? `0 0 20px ${t.glow}` : "none" }}>{c.name}</button>; })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(0,0,0,0.25)", borderRadius: 20, padding: 14, border: `1px solid ${t.light}`, position: "relative", zIndex: 1, backdropFilter: "blur(12px)" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ position: "absolute", inset: -4, borderRadius: 20, background: t.glow, filter: "blur(10px)", opacity: 0.5 }} />
            <img src={getImage(char)} style={{ width: 52, height: 52, borderRadius: 16, objectFit: "cover", position: "relative", zIndex: 1, border: `2px solid ${t.main}` }} onError={(e: any) => { e.target.src = "/characters/luoyin.png"; }} />
          </div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 600 }}>{char.name}</div>{rel && <div style={{ color: ds.color.muted, fontSize: 12, marginTop: 2 }}>{rel.stage} · {rel.mood}</div>}</div>
          {rel && <div style={{ textAlign: "center" }}><div style={{ fontSize: 26, fontWeight: 800, color: t.main }}>{rel.score}</div>{flash && <div style={{ color: flash > 0 ? ds.color.emerald : "#ff7b93", fontSize: 12, fontWeight: 700, animation: "fadeUp 1.5s ease-out" }}>{flash > 0 ? "+" : ""}{flash}</div>}</div>}
        </div>
        <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.04)", marginTop: 10, overflow: "hidden", position: "relative", zIndex: 1 }}><div style={{ height: "100%", borderRadius: 4, width: `${pct()}%`, background: `linear-gradient(90deg, ${t.main}, ${t.main}88)`, transition: "width 0.6s ease", boxShadow: `0 0 14px ${t.glow}` }} /></div>
      </div>
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 8, padding: "12px 0" }}>
        {messages.map((m, i) => <div key={i} style={{ padding: "11px 16px", borderRadius: 18, lineHeight: 1.65, maxWidth: "84%", alignSelf: m.role === "user" ? "flex-end" : m.role === "system" ? "center" : "flex-start", background: m.role === "user" ? `linear-gradient(135deg, ${t.light}, rgba(143,124,255,0.12))` : m.role === "system" ? "rgba(255,215,138,0.06)" : "rgba(255,255,255,0.04)", border: m.role === "user" ? `1px solid ${t.glow}` : "1px solid rgba(255,255,255,0.03)", color: m.role === "system" ? ds.color.gold : ds.color.text, fontSize: 14, animation: "fadeIn 0.3s ease" }}>{m.text}</div>)}
        {loading && <div style={{ padding: "11px 16px", color: ds.color.muted, fontSize: 13, alignSelf: "flex-start" }}>对方正在输入...</div>}
        <div ref={ref} />
      </div>
      <div style={{ display: "flex", gap: 8, paddingTop: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={`对${char.name}说点什么...`} disabled={loading} style={{ flex: 1, padding: "13px 18px", borderRadius: 24, border: `1px solid ${t.light}`, background: "rgba(14,14,36,0.7)", color: ds.color.text, fontSize: 14 }} />
        <button onClick={send} disabled={loading} style={{ padding: "13px 20px", borderRadius: 24, background: `linear-gradient(135deg, ${t.main}, ${t.main}cc)`, color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0, boxShadow: `0 4px 20px ${t.glow}` }}>发送</button>
      </div>
      {showTheater && theaters[char.id] && <TheaterPlayer characterId={char.id} characterName={char.name} scenes={theaters[char.id].scenes} startScene={theaters[char.id].start} onClose={() => setShowTheater(false)} />}
      {activeInvitation && <InvitationFlow invitation={activeInvitation} characterName={char.name} accentColor={t.main} onClose={() => setActiveInvitation(null)} onScoreChange={(delta: number) => { if (rel) { const ps = rel.score; const ns = Math.min(100, Math.max(0, rel.score + delta)); setFlash(delta); setTimeout(() => setFlash(null), 2000); setRel({ ...rel, score: ns }); } }} />}
      {badge && <BadgeUnlock characterName={char.name} prevScore={0} newScore={rel?.score || 0} onClose={() => setBadge(null)} />}
    </div>
  );
}
