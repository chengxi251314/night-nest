"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, ScrollText, User, MessageSquareMore, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import MomentsOverlay from "./moments-overlay";

const tabs = [
  { href: "/", label: "首页", Icon: Home },
  { href: "/chat", label: "聊天", Icon: MessageCircle },
  { href: "/scripts", label: "剧本", Icon: ScrollText },
  { href: "/forum", label: "论坛", Icon: MessageSquareMore },
  { href: "/profile", label: "我的", Icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [showMoments, setShowMoments] = useState(false);

  return (
    <>
      <div className="show-mobile" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, display: "none",
        justifyContent: "center", padding: "0 16px calc(8px + env(safe-area-inset-bottom, 0px))",
        pointerEvents: "none",
      }}>
        <nav style={{
          display: "flex", justifyContent: "space-around", alignItems: "center",
          width: "100%", maxWidth: 400,
          background: "rgba(18,16,40,0.85)", backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24,
          padding: "6px 4px", pointerEvents: "auto",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(143,124,255,0.04) inset",
        }}>
          {tabs.map(t => {
            const active = pathname === t.href || (t.href !== "/" && pathname.startsWith(t.href));
            return (
              <Link key={t.href} href={t.href} style={{ textDecoration: "none", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 1, padding: "6px 12px", borderRadius: 16, flex: 1 }}>
                {active && (
                  <motion.div layoutId="pill" style={{ position: "absolute", inset: 2, borderRadius: 14, background: "rgba(143,124,255,0.15)", border: "1px solid rgba(143,124,255,0.2)" }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                )}
                <t.Icon size={20} style={{ color: active ? "#fff" : "rgba(255,255,255,0.3)", position: "relative", zIndex: 1 }} strokeWidth={active ? 2.5 : 1.5} />
                <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, color: active ? "#fff" : "rgba(255,255,255,0.3)", position: "relative", zIndex: 1 }}>{t.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Moments FAB */}
        <button onClick={() => setShowMoments(true)} style={{
          position: "absolute", top: -48, right: 20,
          width: 44, height: 44, borderRadius: 22,
          background: "linear-gradient(135deg, #ff8ec7, #8f7cff)",
          border: "none", cursor: "pointer", pointerEvents: "auto",
          display: "grid", placeItems: "center",
          boxShadow: "0 6px 24px rgba(255,142,199,0.35)",
        }}>
          <Sparkles size={20} color="#fff" />
        </button>
      </div>

      {showMoments && <MomentsOverlay onClose={() => setShowMoments(false)} />}
    </>
  );
}
