"use client";

import { useState, useEffect } from "react";

export type LLMConfig = { apiKey: string; baseUrl: string; model: string };

const STORAGE_KEY = "nn_llm_config";

export function getLLMConfig(): LLMConfig {
  if (typeof window === "undefined") return { apiKey: "", baseUrl: "", model: "" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { apiKey: "", baseUrl: "", model: "" };
}

export function saveLLMConfig(config: LLMConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export default function LLMSettings({ onClose }: { onClose: () => void }) {
  const [config, setConfig] = useState<LLMConfig>({ apiKey: "", baseUrl: "", model: "" });

  useEffect(() => { setConfig(getLLMConfig()); }, []);

  function save() {
    saveLLMConfig(config);
    onClose();
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)"
    }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "rgba(17,22,40,0.96)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 24, padding: 28, width: 420, maxWidth: "90vw",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
      }}>
        <h2 style={{ margin: "0 0 20px" }}>模型设置</h2>
        <p style={{ color: "#b8b2ca", fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>
          接入你自己的 API。支持 OpenAI、DeepSeek 及所有兼容接口。密钥仅存在浏览器本地。
        </p>
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={{ color: "#b8b2ca", fontSize: 12, display: "block", marginBottom: 4 }}>API Key</label>
            <input type="password" value={config.apiKey} onChange={e => setConfig({ ...config, apiKey: e.target.value })}
              placeholder="sk-..." style={inputStyle} />
          </div>
          <div>
            <label style={{ color: "#b8b2ca", fontSize: 12, display: "block", marginBottom: 4 }}>Base URL</label>
            <input value={config.baseUrl} onChange={e => setConfig({ ...config, baseUrl: e.target.value })}
              placeholder="https://api.deepseek.com/v1" style={inputStyle} />
          </div>
          <div>
            <label style={{ color: "#b8b2ca", fontSize: 12, display: "block", marginBottom: 4 }}>模型名称</label>
            <input value={config.model} onChange={e => setConfig({ ...config, model: e.target.value })}
              placeholder="deepseek-chat" style={inputStyle} />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={save} style={{ flex: 1, padding: "12px", borderRadius: 999, border: "none", background: "linear-gradient(135deg,#ff8ec7,#8f7cff)", color: "white", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>保存</button>
            <button onClick={onClose} style={{ padding: "12px 20px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#b8b2ca", cursor: "pointer", fontSize: 14 }}>取消</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(7,8,18,0.55)", color: "#f6f3ff", fontSize: 14, outline: "none"
} as const;
