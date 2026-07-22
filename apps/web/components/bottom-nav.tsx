"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, ScrollText, Users, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { href: "/", label: "首页", Icon: Home },
  { href: "/chat", label: "聊天", Icon: MessageCircle },
  { href: "/scripts", label: "剧本", Icon: ScrollText },
  { href: "/characters", label: "角色", Icon: Users },
  { href: "/creator", label: "后台", Icon: BarChart3 },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
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
            <Link key={t.href} href={t.href} style={{
              textDecoration: "none", position: "relative",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
              padding: "6px 12px", borderRadius: 16, flex: 1,
              transition: "all 0.3s ease",
            }}>
              {active && (
                <motion.div layoutId="pill" style={{
                  position: "absolute", inset: 2, borderRadius: 14,
                  background: "rgba(143,124,255,0.15)", border: "1px solid rgba(143,124,255,0.2)",
                }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
              <t.Icon size={20} style={{ color: active ? "#fff" : "rgba(255,255,255,0.3)", position: "relative", zIndex: 1 }} strokeWidth={active ? 2.5 : 1.5} />
              <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, color: active ? "#fff" : "rgba(255,255,255,0.3)", position: "relative", zIndex: 1 }}>{t.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
