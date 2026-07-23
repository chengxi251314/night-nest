"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import BadgeUnlock, { checkBadge, resetBadges } from "@/components/badge-unlock";
import { playPing, playUnlock } from "@/lib/sounds";

type Message = { role: string; content: string; userId?: string };

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100";
const scriptFavs: Set<string> = new Set(JSON.parse(typeof window !== "undefined" ? localStorage.getItem("nn_script_favs") || "[]" : "[]"));

type Props = {
  scriptId: string;
  characterName: string;
  messages: Message[];
  onSend: (content: string) => Promise<void>;
  onBack: () => void;
};

export default function ScriptChat({ scriptId, characterName, messages, onSend, onBack }: Props) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState<number | null>(null);
  const [badge, setBadge] = useState<any>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { ref.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { if (typeof Notification !== "undefined" && Notification.permission === "default") Notification.requestPermission(); }, []);
  useEffect(() => {
    const saved = localStorage.getItem(`nn_script_score_${scriptId}`);
    if (saved) setScore(parseInt(saved));
  }, [scriptId]);

  function notify(body: string) {
    if (typeof Notification !== "undefined" && Notification.permission === "granted" && document.hidden) {
      new Notification(characterName, { body });
    }
  }

  function toggleFav(index: number) {
    const key = `${scriptId}-${index}`;
    if (scriptFavs.has(key)) { scriptFavs.delete(key); } else { scriptFavs.add(key); }
    localStorage.setItem("nn_script_favs", JSON.stringify([...scriptFavs]));
  }

  async function send() {
    const v = input.trim(); if (!v || loading) return;
    setInput(""); setLoading(true);
    try {
      await onSend(v);
      playPing();
      const delta = Math.floor(Math.random() * 4) + 1;
      const prevScore = score;
      const ns = Math.min(100, score + delta);
      setScore(ns);
      setFlash(delta); setTimeout(() => setFlash(null), 1500);
      localStorage.setItem(`nn_script_score_${scriptId}`, ns.toString());
      const bg = checkBadge(characterName, prevScore, ns);
      if (bg) { setBadge(bg); playUnlock(); }
      if (messages.length > 0) notify(messages[messages.length - 1]?.content || "");
    } catch {} finally { setLoading(false); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 56px - 80px)" }}>
      <div style={{ display: "flex", gap: 8, padding: "8px 0", alignItems: "center" }}>
        <button onClick={() => { resetBadges(); onBack(); }} style={{ padding: "6px 14px", borderRadius: 16, background: "rgba(255,255,255,0.06)", color: "#8a87a0", fontSize: 13 }}>← 返回</button>
        <span style={{ fontWeight: 600, fontSize: 15 }}>{characterName}</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#ffd78a", fontWeight: 700, fontSize: 16 }}>{score}</span>
          {flash && <span style={{ color: "#74e4ae", fontSize: 12, fontWeight: 700, animation: "fadeUp 1.5s ease-out" }}>+{flash}</span>}
        </div>
      </div>
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
        {messages.map((m, i) => {
          const isFav = scriptFavs.has(`${scriptId}-${i}`);
          return (
            <div key={i} style={{ position: "relative" }}>
              <div style={{ padding: "10px 14px", borderRadius: 16, lineHeight: 1.6, maxWidth: "85%", alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? "linear-gradient(135deg, rgba(143,124,255,0.3), rgba(255,142,199,0.2))" : "rgba(255,255,255,0.04)", fontSize: 14 }}>
                {m.content}
                {m.role === "character" && (
                  <button onClick={() => toggleFav(i)} style={{ position: "absolute", top: -4, right: -4, width: 24, height: 24, borderRadius: "50%", background: isFav ? "rgba(255,215,138,0.2)" : "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "grid", placeItems: "center", fontSize: 11, color: isFav ? "#ffd78a" : "#8a87a0", cursor: "pointer" }}>
                    {isFav ? "★" : "☆"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {loading && <div style={{ padding: "10px 14px", color: "#8a87a0", fontSize: 13 }}>对方正在输入...</div>}
        <div ref={ref} />
      </div>
      <div style={{ display: "flex", gap: 8, paddingTop: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="发言..." style={{ flex: 1, padding: "10px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(18,18,40,0.6)", color: "#f0edf6", fontSize: 14 }} />
        <button onClick={send} disabled={loading} style={{ padding: "10px 16px", borderRadius: 20, background: "linear-gradient(135deg,#8f7cff,#ff8ec7)", color: "#fff", fontWeight: 600, fontSize: 14, flexShrink: 0 }}>发送</button>
      </div>
      {badge && <BadgeUnlock characterName={characterName} prevScore={0} newScore={score} onClose={() => setBadge(null)} />}
    </div>
  );
}
