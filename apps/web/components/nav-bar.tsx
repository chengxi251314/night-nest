"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "./auth-button";
import LLMSettings from "./llm-settings";

const links = [
  { href: "/", label: "首页" },
  { href: "/chat", label: "聊天" },
  { href: "/scripts", label: "剧本" },
  { href: "/characters", label: "角色" },
  { href: "/creator", label: "后台" },
  { href: "/simulator", label: "模拟器" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [showSettings, setShowSettings] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navStyle = (active: boolean) => ({
    padding: "8px 14px", borderRadius: 999, fontSize: 14, textDecoration: "none", whiteSpace: "nowrap" as const,
    background: active ? "rgba(255,215,138,0.08)" : "rgba(255,255,255,0.05)",
    border: `1px solid ${active ? "rgba(255,215,138,0.35)" : "rgba(255,255,255,0.08)"}`,
    color: active ? "#fff" : "#b8b2ca", transition: "0.2s ease",
  });

  return (
    <>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, display: "grid", placeItems: "center", background: "linear-gradient(135deg, #ff8ec7, #8f7cff)", fontWeight: 800, fontSize: 16, color: "#fff" }}>夜</div>
          <div className="hide-mobile">
            <small style={{ display: "block", color: "#ffd78a", letterSpacing: "0.2em", fontSize: 11, marginBottom: 2 }}>NIGHT NEST</small>
            <span style={{ fontSize: 16, color: "#f6f3ff", fontWeight: 600 }}>夜栖协议</span>
          </div>
        </Link>

        <nav className="hide-mobile" style={{ display: "flex", gap: 4 }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} style={navStyle(pathname === l.href)}>{l.label}</Link>
          ))}
        </nav>

        <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
          <button onClick={() => setShowSettings(true)} className="hide-mobile" style={{ padding: "8px 12px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#b8b2ca", cursor: "pointer", fontSize: 13 }}>模型</button>
          <div className="hide-mobile"><AuthButton /></div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="show-mobile" style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#b8b2ca", cursor: "pointer", fontSize: 18, display: "none" }}>☰</button>
        </div>
      </header>

      {menuOpen && (
        <div style={{ display: "none", flexDirection: "column", gap: 6, paddingBottom: 12 }} className="show-mobile">
          {links.map((l) => (
            <Link key={l.href} href={l.href} style={navStyle(pathname === l.href)} onClick={() => setMenuOpen(false)}>{l.label}</Link>
          ))}
          <button onClick={() => { setShowSettings(true); setMenuOpen(false); }} style={{ ...navStyle(false), textAlign: "left" }}>模型设置</button>
          <AuthButton />
        </div>
      )}

      {showSettings && <LLMSettings onClose={() => setShowSettings(false)} />}
    </>
  );
}
