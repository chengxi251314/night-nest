"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, ScrollText, MessageSquare, User as UserIcon } from "lucide-react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100";

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (q.trim().length < 2) { setResults(null); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch(API + "/v1/search?q=" + encodeURIComponent(q.trim()));
        if (r.ok) setResults(await r.json());
      } catch { /* */ }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [q]);

  const hasResults = results && (results.scripts?.length > 0 || results.topics?.length > 0 || results.characters?.length > 0);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 250, background: "rgba(3,3,16,0.92)", backdropFilter: "blur(16px)", display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 16px 0" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 500 }}>
        {/* Search input */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderRadius: 18, border: "1px solid rgba(143,124,255,0.25)", background: "rgba(18,18,40,0.8)" }}>
            <Search size={18} style={{ color: "#8f7cff", flexShrink: 0 }} />
            <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="搜索剧本、话题、角色..." style={{ flex: 1, background: "none", border: "none", color: "#f0edf6", fontSize: 16, outline: "none" }} />
            {q && <button onClick={() => setQ("")} style={{ padding: 2 }}><X size={16} style={{ color: "#8a87a0" }} /></button>}
          </div>
          <button onClick={onClose} style={{ padding: "12px 16px", borderRadius: 14, background: "rgba(255,255,255,0.04)", color: "#8a87a0", fontSize: 14 }}>取消</button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: "70vh", overflow: "auto" }}>
          {loading && <div style={{ color: "#8a87a0", fontSize: 13, textAlign: "center", padding: 20 }}>搜索中...</div>}

          {!loading && q.length >= 2 && !hasResults && (
            <div style={{ color: "#8a87a0", fontSize: 13, textAlign: "center", padding: 30 }}>没有找到相关结果</div>
          )}

          {results?.characters?.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: "#ff8ec7", fontSize: 11, fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}><UserIcon size={12} /> 角色</div>
              {results.characters.map((c: any) => (
                <Link key={c.id} href="/chat" onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.02)", marginBottom: 4, textDecoration: "none", color: "inherit" }}>
                  <img src={c.imageUrl || "/characters/" + c.id + ".png"} alt="" style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover" }} />
                  <div><div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div><div style={{ color: "#8a87a0", fontSize: 11 }}>{c.title}</div></div>
                </Link>
              ))}
            </div>
          )}

          {results?.scripts?.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: "#ffd78a", fontSize: 11, fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}><ScrollText size={12} /> 剧本</div>
              {results.scripts.map((s: any) => (
                <Link key={s.id} href="/scripts" onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.02)", marginBottom: 4, textDecoration: "none", color: "inherit" }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{s.title}</div>
                  <div style={{ color: "#8a87a0", fontSize: 11, flex: 1 }}>{s.description?.slice(0, 30)}</div>
                </Link>
              ))}
            </div>
          )}

          {results?.topics?.length > 0 && (
            <div>
              <div style={{ color: "#8f7cff", fontSize: 11, fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}><MessageSquare size={12} /> 讨论</div>
              {results.topics.map((t: any) => (
                <Link key={t.id} href="/forum" onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.02)", marginBottom: 4, textDecoration: "none", color: "inherit" }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{t.title}</div>
                  <div style={{ color: "#8a87a0", fontSize: 11 }}>{t.replyCount} 回复</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
