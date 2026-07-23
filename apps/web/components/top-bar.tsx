"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Search } from "lucide-react";
import MomentsOverlay from "./moments-overlay";
import SearchOverlay from "./search-overlay";
import NotificationBell from "./notification-bell";

const links = [
  { href: "/", label: "首页" },
  { href: "/chat", label: "聊天" },
  { href: "/scripts", label: "剧本" },
  { href: "/characters", label: "角色" },
  { href: "/creator", label: "后台" },
];

export default function TopBar() {
  const pathname = usePathname();
  const [showMoments, setShowMoments] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nn_profile");
      if (raw) { const p = JSON.parse(raw); if (p.avatar) setAvatar(p.avatar); if (p.nickname) setNickname(p.nickname); }
    } catch {}
  }, []);

  return (
    <>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", maxWidth: 768, margin: "0 auto", position: "sticky", top: 0, zIndex: 50, background: "rgba(8,8,25,0.8)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #ff8ec7, #8f7cff)", display: "grid", placeItems: "center", boxShadow: "0 4px 16px rgba(143,124,255,0.4)", fontWeight: 800, fontSize: 15, color: "#fff" }}>夜</div>
          <span style={{ fontWeight: 700, fontSize: 17 }}>夜栖协议</span>
          <NotificationBell />
          <button onClick={() => setShowSearch(true)} style={{ padding: "4px 8px", borderRadius: 8, color: "#8a87a0", display: "flex", alignItems: "center" }}><Search size={18} /></button>
        </div>
        <nav className="hide-mobile" style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{ padding: "6px 12px", borderRadius: 999, fontSize: 13, textDecoration: "none", background: pathname === l.href ? "rgba(255,215,138,0.1)" : "transparent", color: pathname === l.href ? "#ffd78a" : "#8a87a0" }}>{l.label}</Link>
          ))}
          <button onClick={() => setShowMoments(true)} style={{ padding: "6px 12px", borderRadius: 999, fontSize: 13, fontWeight: 600, color: "#ff8ec7" }}>动态</button>
          <Link href="/profile" style={{ padding: "6px 12px", borderRadius: 999, fontSize: 13, textDecoration: "none", background: pathname === "/profile" ? "rgba(255,215,138,0.1)" : "transparent", color: pathname === "/profile" ? "#ffd78a" : "#8a87a0", display: "flex", alignItems: "center", gap: 6 }}>
            {avatar ? <img src={avatar} alt="" style={{ width: 22, height: 22, borderRadius: 8, objectFit: "cover" }} />
              : nickname ? <span style={{ width: 22, height: 22, borderRadius: 8, background: "linear-gradient(135deg,#8f7cff,#ff8ec7)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>{nickname[0]?.toUpperCase()}</span>
              : <User size={16} />}
            <span>{nickname || "我的"}</span>
          </Link>
        </nav>
      </header>
      {showMoments && <MomentsOverlay onClose={() => setShowMoments(false)} />}
      {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
    </>
  );
}
