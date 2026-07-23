"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Trophy, Star, Heart, Flame, Sparkles } from "lucide-react";

type Badge = { id: string; score: number; label: string; icon: any; color: string };

const badges: Badge[] = [
  { id: "first-meet", score: 30, label: "初识之证", icon: Star, color: "#8f7cff" },
  { id: "confidant", score: 60, label: "知己之印", icon: Heart, color: "#ff8ec7" },
  { id: "devotion", score: 85, label: "倾心之章", icon: Flame, color: "#ffd78a" },
  { id: "obsession", score: 92, label: "沉沦之冕", icon: Trophy, color: "#ffd78a" },
];

const unlockedBadges: Set<string> = new Set();

type Props = { characterName: string; prevScore: number; newScore: number; onClose: () => void };

export default function BadgeUnlock({ characterName, prevScore, newScore, onClose }: Props) {
  const [badge, setBadge] = useState<Badge | null>(null);

  useEffect(() => {
    for (const b of badges) {
      if (newScore >= b.score && prevScore < b.score && !unlockedBadges.has(b.id)) {
        unlockedBadges.add(b.id);
        setBadge(b);
        const t = setTimeout(() => { setBadge(null); onClose(); }, 3000);
        return () => clearTimeout(t);
      }
    }
    onClose();
  }, []);

  if (!badge) return null;

  const Icon = badge.icon;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
        style={{ textAlign: "center", padding: 40, background: "rgba(20,18,40,0.95)", borderRadius: 32, border: `2px solid ${badge.color}40`, boxShadow: `0 0 80px ${badge.color}20` }}>
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <Icon size={64} style={{ color: badge.color, filter: `drop-shadow(0 0 20px ${badge.color}40)` }} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ marginTop: 16, fontSize: 14, color: "#8a87a0" }}>{characterName}</motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ marginTop: 8, fontSize: 24, fontWeight: 800, color: badge.color }}>{badge.label}</motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div key={i} animate={{ y: [-20, -80], opacity: [1, 0] }} transition={{ duration: 1.5 + Math.random(), repeat: Infinity, delay: Math.random() * 1 }}
              style={{ width: 4, height: 4, borderRadius: "50%", background: badge.color }} />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function checkBadges(characterName: string, prevScore: number, newScore: number): Badge | null {
  for (const b of badges) {
    if (newScore >= b.score && prevScore < b.score && !unlockedBadges.has(b.id)) {
      unlockedBadges.add(b.id);
      return b;
    }
  }
  return null;
}

export function resetBadges() { unlockedBadges.clear(); }
