"use client";

import { useState, useEffect } from "react";
import { characters } from "@/lib/data";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100";
const card = { background: "var(--surface)", borderRadius: 16, padding: 16, border: "1px solid var(--border)" } as const;

type Stats = { users: number; characters: number; conversations: number; messages: number; relationshipsByStage: Record<string, number>; relationshipsByCharacter: Record<string, { total: number; avgScore: number; stage: string }> };

export default function CreatorStudio() {
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => { fetch(`${API}/v1/admin/stats`).then(r => r.json()).then(setStats); }, []);

  const tabs = ["概览", "角色", "剧本", "漏斗"];
  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{ padding: "8px 16px", borderRadius: 16, fontSize: 13, background: i === tab ? "rgba(255,215,138,0.12)" : "rgba(255,255,255,0.04)", color: i === tab ? "#ffd78a" : "#8a8a9a", fontWeight: i === tab ? 600 : 400 }}>{t}</button>
        ))}
      </div>

      {tab === 0 && stats && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="grid-2-mobile" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8 }}>
            {[["用户", stats.users], ["角色", stats.characters], ["会话", stats.conversations], ["消息", stats.messages]].map(([l, v]) => (
              <div key={l} style={{ ...card, textAlign: "center" }}><div style={{ color: "#8a8a9a", fontSize: 11 }}>{l}</div><div style={{ fontSize: 24, fontWeight: 700, color: "#ffd78a", marginTop: 4 }}>{v}</div></div>
            ))}
          </div>
          <div style={card}>
            <h3 style={{ fontSize: 15, marginBottom: 10 }}>关系阶段</h3>
            {Object.entries(stats.relationshipsByStage).map(([s, c]) => (
              <div key={s} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 3 }}><span style={{ color: "#8a8a9a" }}>{s}</span><span>{c}</span></div>
                <div style={{ height: 6, borderRadius: 6, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 6, width: `${(c / Object.values(stats.relationshipsByStage).reduce((a,b)=>a+b,0)) * 100}%`, background: "#8f7cff" }} />
                </div>
              </div>
            ))}
          </div>
          <div style={card}>
            <h3 style={{ fontSize: 15, marginBottom: 10 }}>角色均分</h3>
            {Object.entries(stats.relationshipsByCharacter).map(([id, d]) => {
              const ch = characters.find(c => c.id === id);
              return (
                <div key={id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <img src={`/characters/${id}.png`} alt="" style={{ width: 28, height: 28, borderRadius: 8, objectFit: "cover" }} />
                    <span style={{ fontSize: 14 }}>{ch?.name || id}</span>
                    <span style={{ color: "#8a8a9a", fontSize: 11 }}>{d.stage}</span>
                  </div>
                  <span style={{ color: "#ffd78a", fontWeight: 600 }}>{d.avgScore}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {characters.map(c => (
            <div key={c.id} style={{ ...card, display: "flex", gap: 10, alignItems: "center" }}>
              <img src={`/characters/${c.id}.png`} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover" }} />
              <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div><div style={{ color: "#8a8a9a", fontSize: 11 }}>{c.tagline}</div></div>
              <span style={{ color: "#74e4ae", fontSize: 11, background: "rgba(116,228,174,0.1)", padding: "3px 8px", borderRadius: 8 }}>已发布</span>
            </div>
          ))}
        </div>
      )}

      {tab === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {characters.map(c => (
            <div key={c.id} style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <img src={`/characters/${c.id}.png`} alt="" style={{ width: 28, height: 28, borderRadius: 8 }} />
                <span style={{ fontWeight: 600 }}>{c.name}</span>
              </div>
              {c.story.map(n => (
                <div key={n.id} style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{n.title}</div>
                  <div style={{ color: "#8a8a9a", fontSize: 12, marginTop: 2 }}>{n.body}</div>
                  <div style={{ display: "flex", gap: 4, marginTop: 4 }}>{n.choices.map(ch => <span key={ch.id} style={{ padding: "2px 8px", borderRadius: 8, fontSize: 10, background: "rgba(143,124,255,0.1)", color: "#8f7cff" }}>{ch.label}</span>)}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {tab === 3 && (
        <div style={card}>
          {[{ l: "发现角色", p: 100 }, { l: "首次对话", p: 70 }, { l: "建立关系", p: 45 }, { l: "深度互动", p: 25 }, { l: "付费转化", p: 10 }].map((s, i) => (
            <div key={s.l} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}><span style={{ color: "#8a8a9a" }}>{s.l}</span><span>{s.p}%</span></div>
              <div style={{ height: 24, borderRadius: 12, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 12, width: `${s.p}%`, background: ["#8f7cff","#78dfff","#ff8ec7","#ffd78a","#74e4ae"][i], display: "flex", alignItems: "center", paddingLeft: 10 }}>
                  <span style={{ color: "#0a0e1c", fontWeight: 600, fontSize: 12 }}>{s.p}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
