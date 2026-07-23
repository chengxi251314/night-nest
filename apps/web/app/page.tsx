"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, ScrollText, Users, BarChart3, Sparkles, ChevronRight } from "lucide-react";

import { characters } from "@/lib/data";
import { CardSkeleton } from "@/components/skeleton";

const charGradients: Record<string, { from: string; to: string }> = {
  luoyin: { from: "#c44a6a", to: "#6b1d3a" },
  shenye: { from: "#c89850", to: "#6b4d1d" },
  qinhuai: { from: "#4a9cc4", to: "#1d3a5a" },
  fuyanzhi: { from: "#50b4a0", to: "#1d4a3a" },
};

export default function HomePage() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 400); return () => clearTimeout(t); }, []);

  const [allChars, setAllChars] = useState(characters);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100";
  useEffect(() => {
    fetch(API_BASE + "/v1/characters").then(r => r.json()).then(d => {
      if (d.items && Array.isArray(d.items)) {
        const apiOnly = d.items.filter((c: any) => !characters.find(hc => hc.id === c.id));
        setAllChars([...characters, ...apiOnly.map((c: any) => ({
          id: c.id, name: c.name || "", title: c.title || "", tagline: c.tagline || "",
          intro: c.intro || "", world: c.world || "", traits: c.traits || [],
          stages: c.stages || [], memories: c.memories || [],
          quickActions: c.quickActions || [], story: c.story || [], imageUrl: c.imageUrl || "",
        }))]);
      }
    }).catch(() => {});
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22, paddingTop: 6 }}>
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
        borderRadius: 28, overflow: "hidden", position: "relative",
        background: "linear-gradient(160deg, rgba(30,25,60,0.95), rgba(18,14,36,0.98))",
        border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 4px 30px rgba(0,0,0,0.3)"
      }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }} transition={{ duration: 12, repeat: Infinity }}
            style={{ position: "absolute", top: -50, right: -30, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(143,124,255,0.25), transparent 70%)" }} />
          <motion.div animate={{ scale: [1.15, 1, 1.15], opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 10, repeat: Infinity, delay: 3 }}
            style={{ position: "absolute", bottom: -30, left: -20, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,142,199,0.2), transparent 70%)" }} />
        </div>
        <div style={{ padding: "26px 22px 22px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 30, height: 30, borderRadius: 10, background: "linear-gradient(135deg, #ff8ec7, #8f7cff)", display: "grid", placeItems: "center", boxShadow: "0 4px 16px rgba(143,124,255,0.4)" }}>
              <Sparkles size={15} color="#fff" />
            </div>
            <span style={{ color: "#ffd78a", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em" }}>NIGHT NEST</span>
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.1, marginBottom: 6 }}>
            与角色建立<br />
            <span style={{ background: "linear-gradient(135deg, #ffd78a, #ff8ec7, #8f7cff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>真实连接</span>
          </h1>
          <p style={{ color: "#8a87a0", fontSize: 14, lineHeight: 1.6, maxWidth: 280 }}>不止是聊天。关系推进、剧情选择、记忆沉淀。</p>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <Link href="/chat" style={{ padding: "11px 20px", borderRadius: 999, background: "linear-gradient(135deg, #8f7cff, #ff8ec7)", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none", boxShadow: "0 4px 20px rgba(143,124,255,0.35)", display: "inline-flex", alignItems: "center", gap: 6 }}>
              开始对话 <ChevronRight size={15} />
            </Link>
            <Link href="/scripts" style={{ padding: "11px 18px", borderRadius: 999, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,215,138,0.12)", color: "#ffd78a", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
              剧本大厅
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Characters */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>角色</h2>
          <Link href="/characters" style={{ color: "#8a87a0", fontSize: 13, display: "flex", alignItems: "center", gap: 2 }}>全部 <ChevronRight size={13} /></Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {!ready ? [1, 2, 3, 4].map(i => <CardSkeleton key={i} />) :
            allChars.map((c: any, i: number) => {
              const g = charGradients[c.id] || charGradients.luoyin;
              return (
                <motion.div key={c.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Link href="/chat" style={{ textDecoration: "none", color: "inherit", display: "flex", gap: 14, alignItems: "center", background: "linear-gradient(135deg, rgba(20,18,40,0.7), rgba(14,12,32,0.8))", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 18, padding: 15, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", right: -15, top: -15, width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle, ${g.from}15, transparent 70%)` }} />
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div style={{ position: "absolute", inset: -2, borderRadius: 16, background: `linear-gradient(135deg, ${g.from}, ${g.to})`, opacity: 0.25, filter: "blur(5px)" }} />
                      <img src={c.imageUrl || `/characters/${c.id}.png`} alt="" style={{ width: 64, height: 64, borderRadius: 14, objectFit: "cover", position: "relative", zIndex: 1 }} onError={(e: any) => { e.target.src = "/characters/luoyin.png"; }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
                      <div style={{ fontWeight: 700, fontSize: 17 }}>{c.name}</div>
                      <div style={{ color: g.from, fontSize: 12, fontWeight: 500, margin: "1px 0 4px" }}>{c.tagline}</div>
                      <div style={{ display: "flex", gap: 4 }}>{c.traits.slice(0, 3).map(t => <span key={t} style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10, background: "rgba(255,215,138,0.06)", color: "#ffd78a" }}>{t}</span>)}</div>
                    </div>
                    <ChevronRight size={18} style={{ color: "#8a87a0", opacity: 0.3 }} />
                  </Link>
                </motion.div>
              );
            })}
        </div>
      </div>

      `n`n      {/* Quick links */}
      <div className="grid-2-mobile" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
        {[
          { href: "/scripts", Icon: ScrollText, label: "剧本", sub: "加入故事", color: "#8f7cff" },
          { href: "/characters", Icon: Users, label: "角色", sub: "全部阵容", color: "#ff8ec7" },
          { href: "/creator", Icon: BarChart3, label: "后台", sub: "数据看板", color: "#78dfff" },
        ].map(({ href, Icon, label, sub, color }) => (
          <Link key={href} href={href} style={{ textDecoration: "none", color: "inherit" }}>
            <motion.div whileTap={{ scale: 0.96 }} style={{
              background: "linear-gradient(160deg, rgba(20,18,36,0.7), rgba(14,12,28,0.8))", border: "1px solid rgba(255,255,255,0.03)", borderRadius: 18, padding: "22px 12px", textAlign: "center",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: -12, right: -12, width: 60, height: 60, borderRadius: "50%", background: `radial-gradient(circle, ${color}12, transparent 70%)` }} />
              <Icon size={24} style={{ color, marginBottom: 8, position: "relative" }} strokeWidth={1.5} />
              <div style={{ fontWeight: 700, fontSize: 13, position: "relative" }}>{label}</div>
              <div style={{ color: "#8a87a0", fontSize: 10, marginTop: 2, position: "relative" }}>{sub}</div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
