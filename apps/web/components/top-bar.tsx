"use client";

import { useState } from "react";
import AuthButton from "./auth-button";
import LLMSettings from "./llm-settings";

export default function TopBar() {
  const [showSettings, setShowSettings] = useState(false);
  return (
    <>
      <header style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 16px", maxWidth: 768, margin: "0 auto",
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(8,8,25,0.8)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg, #ff8ec7, #8f7cff)",
            display: "grid", placeItems: "center",
            boxShadow: "0 4px 16px rgba(143,124,255,0.4)",
            fontWeight: 800, fontSize: 15, color: "#fff"
          }}>夜</div>
          <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: "0.02em" }}>夜栖协议</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setShowSettings(true)} style={{
            padding: "6px 14px", borderRadius: 999, fontSize: 12,
            border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)",
            transition: "all 0.2s"
          }}>模型</button>
          <AuthButton />
        </div>
      </header>
      {showSettings && <LLMSettings onClose={() => setShowSettings(false)} />}
    </>
  );
}
