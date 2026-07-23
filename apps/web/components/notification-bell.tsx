"use client";

import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetch(API + "/v1/notifications").then(r => r.json()).then(d => {
      setItems(d.items || []);
      setUnread(d.unread || 0);
    }).catch(() => {});
  }, [open]);

  async function markRead() {
    await fetch(API + "/v1/notifications/read-all", { method: "POST" });
    setUnread(0);
  }

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => { setOpen(!open); if (open) markRead(); }} style={{ padding: "6px 8px", borderRadius: 8, color: "#8a87a0", display: "flex", alignItems: "center", position: "relative" }}>
        <Bell size={18} />
        {unread > 0 && (
          <span style={{ position: "absolute", top: 2, right: 2, width: 16, height: 16, borderRadius: 8, background: "#ff7b93", color: "#fff", fontSize: 10, fontWeight: 700, display: "grid", placeItems: "center" }}>{unread > 9 ? "9+" : unread}</span>
        )}
      </button>

      {open && (
        <div style={{ position: "absolute", top: 40, right: -10, width: 320, maxWidth: "90vw", maxHeight: 400, overflow: "auto", background: "rgba(20,20,50,0.98)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 12, zIndex: 300, backdropFilter: "blur(24px)", boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>通知</span>
            <button onClick={() => setOpen(false)} style={{ padding: 2, color: "#8a87a0" }}><X size={14} /></button>
          </div>

          {items.length === 0 && (
            <div style={{ color: "#8a87a0", fontSize: 13, textAlign: "center", padding: 20 }}>暂无通知</div>
          )}

          {items.map((n, i) => (
            <div key={n.id || i} style={{
              padding: "10px 12px", borderRadius: 12, marginBottom: 4,
              background: n.read ? "transparent" : "rgba(143,124,255,0.06)",
              border: n.read ? "1px solid transparent" : "1px solid rgba(143,124,255,0.08)"
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{n.title}</div>
              <div style={{ fontSize: 12, color: "#8a87a0" }}>{n.body}</div>
              <div style={{ fontSize: 10, color: "#8a87a0", marginTop: 4 }}>{fmtDate(n.createdAt)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function fmtDate(d: string) {
  try {
    const diff = Date.now() - new Date(d).getTime();
    if (diff < 3600000) return Math.floor(diff / 60000) + "分钟前";
    if (diff < 86400000) return Math.floor(diff / 3600000) + "小时前";
    return new Date(d).toLocaleDateString("zh-CN");
  } catch { return ""; }
}
